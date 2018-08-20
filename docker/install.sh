#!/bin/bash

# This script is meant for quick install via:
#   $ curl -fsSL get.opla.ai -o install.sh
#   $ chmod +x install.sh
#   $ ./install.sh

# We wrap the entire script in a big function which we only call at the very end, in order to
# protect against the possibility of the connection dying mid-script. This protects us against
# the problem described in this blog post:
#   http://blog.existentialize.com/dont-pipe-to-your-shell.html
_() {

	rev=${OPLA_CE_REV:-master}
	NON_INTERACTIVE=${NON_INTERACTIVE:-}
	DOCKER_COMPOSE_VERSION=${DOCKER_COMPOSE_VERSION:-1.21.0}
	dockerMajorVersionRequired=17

	detect_os() {
		unameOut="$(uname -s)"
		case "${unameOut}" in
		Linux*) machine=Linux ;;
		Darwin*) machine=Mac ;;
		CYGWIN*) machine=Cygwin ;;
		MINGW*) machine=MinGw ;;
		*) machine="UNKNOWN:${unameOut}" ;;
		esac

		echo ${machine}
	}

	os=$(detect_os)
	echo "OS detected : $os"

	create_temp_dir() {
		case $os in
		Linux)
			tempDir=$(mktemp -d)
			;;
		Mac)
			tempDir=$(mktemp -d 2>/dev/null || mktemp -d "${TMPDIR:-/tmp}/opla.$(uuidgen)")
			;;
		*) ;;
		esac

	}

	while [ $# -gt 0 ]; do
		case "$1" in
		--rev)
			rev="$2"
			shift
			;;
		--non-interactive)
			NON_INTERACTIVE=9
			;;
		--no-run)
			NO_RUN=9
			;;
		--debug)
			DEBUG=9
			;;
		--*)
			echo "Illegal option $1"
			;;
		esac
		shift $(($# > 0 ? 1 : 0))
	done

	command_exists() {
		command -v "$@" >/dev/null 2>&1
	}

	error() {
		echo "$@" | (fold -s || cat) >&2
	}

	fail() {
		local error_code="$1"
		shift
		echo "### INSTALLATION FAILED ###" >&2
		echo ""
		error "$@"
		echo "" >&2
		echo "You can report bugs at: http://github.com/opla/community-edition/issues" >&2
		exit 1
	}

	check_requirements() {
		echo "# Checking for requirements..."
		which unzip >/dev/null || fail "E_UNZIP_MISSING" "Please install unzip"
		which curl >/dev/null || fail "E_CURL_MISSING" "Please install curl"
	}

	semverParse() {
		major="${1%%.*}"
		minor="${1#$major.}"
		minor="${minor%%.*}"
		patch="${1#$major.$minor.}"
		patch="${patch%%[-.]*}"
	}

	promptYesNo() {
		if [ -z "$NON_INTERACTIVE" ]; then
			question=$1
			echo ""
			echo -n $question" (Y/n)\\n"
			read answer
			if [ -z $answer ]; then
				echo "--> Yes"
				return 0
			fi
			if [ "$answer" != "${answer#[Yy]}" ]; then
				echo "--> Yes"
				return 0
			else
				echo "--> No"
				return 1
			fi
			echo ""
		else
			return 0
		fi
	}

	checkDockerVersion() {
		docker_version="$(docker -v | cut -d ' ' -f3 | cut -d ',' -f1)"
		echo "Found docker version $docker_version"
		semverParse "$docker_version"

		shouldWarn=0
		if [ "$major" -lt "$dockerMajorVersionRequired" ]; then
			fail "E_OLD_DOCKER" "Your docker version is too old. Please have docker v.$dockerMajorVersionRequired+"
		fi
	}

	installDocker() {
		if command_exists docker; then
			checkDockerVersion
		else
			case $os in
			Linux)
				if promptYesNo "Do you want to install Docker ?"; then
					echo "Installing docker for $os"
					sh -c "$(curl -sSL https://get.docker.com/)"
					checkDockerVersion
				else
					echo "Skipping docker install"
				fi
				;;

			Mac)
				echo "We are unable to install docker on your os ($os)."
				echo "Please install docker and docker-compose and launch this tool again."
				echo ""
				echo "To install Docker on Mac, please visit the following page :"
				echo "--> https://docs.docker.com/docker-for-mac/install/"
				echo ""
				exit 0
				;;

			\
				*)
				fail E_OS_NOT_SUPPORTED "Your operating system ($os) is not supported. Please see https://github.com/Opla/community-edition#build-and-run for alternatives."
				;;
			esac
		fi
	}

	check_docker_compose_version() {
		docker_compose_version="$(docker-compose -v | cut -d ' ' -f3 | cut -d ',' -f1)"
		echo "Found docker-compose version $docker_compose_version"
		semverParse "$docker_compose_version"
	}

	installDockerCompose() {
		if command_exists docker-compose; then
			check_docker_compose_version
		else
			if promptYesNo "Do you want to install docker-compose ?"; then
				echo "Installing docker-compose"
				curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m) >docker-compose
				chmod +x docker-compose
				mv docker-compose /usr/local/bin
				check_docker_compose_version
			else
				echo "Skipping docker-compose install"
			fi
		fi
	}

	downloadAndUnpackDockerfiles() {
		dir=$(pwd)
		echo "# Downloading Opla Dockerfiles..."
		curl -#L --progress-bar "https://github.com/Opla/opla/archive/$rev.zip" -o $tempDir/source.zip
		cd $tempDir
		unzip -q source.zip
		rm source.zip
		cp -r opla*/docker* opla-ce
		# TODO check for directory existence.
		rm -Rf $dir/opla-ce
		mkdir $dir/opla-ce
		cp -R opla-ce $dir
		cd $dir/opla-ce
	}

	install() {
		create_temp_dir
		check_requirements
		echo "# Installing docker..."
		installDocker
		installDockerCompose
		downloadAndUnpackDockerfiles
	}

	print_current_config() {
		echo "Current Config is :"
		echo ""
		cat ./.env | grep "OPLA_"
	}

	opla_domain() {
		cat ./.env | sed -n 's/OPLA_FRONT_DOMAIN=\(.*\)/\1/p'
	}

	edit_configuration() {
		vim ./.env || nano ./.env || fail "E_TEXT_EDITOR_MISSING" "Please install a text editor : vim or nano."
	}

	check_quit() {
		if [ ! -z $QUIT ]; then
			echo "clean up..."
			exit
		fi
	}

	test_opla_up() {
		check_quit
		until curl --fail http://localhost/ && echo "Connected to Opla Frontend !"; do
			check_quit
			sleep 5
		done
	}

	configure_opla() {
		print_current_config
		while ! promptYesNo "Are you happy with the above configuration ?"; do
			check_quit
			edit_configuration
			print_current_config
		done
	}

	open_browser() {
		url=$1
		if which xdg-open >/dev/null; then
			xdg-open $url
		elif which gnome-open >/dev/null; then
			gnome-open $url
		elif open >/dev/null; then
			open $url
		fi
	}

	if [ -z "$NON_INTERACTIVE" ]; then
		# trap ctrl-c and call ctrl_c()
		trap cleanup INT
	fi

	function cleanup() {
		while kill -0 $PID >& /dev/null; do wait $PID; echo "check again"; done
		if $(command_exists docker-compose); then
			docker-compose stop
			docker-compose rm -f
		fi
		QUIT=1
	}

	install
	# Prompt for env variables and replace them in the .env file
	#
	echo "# Configuration of Opla"
	echo ""
	configure_opla

	if [ -z "$NO_RUN" ]; then
		echo "# Starting docker-compose..."
		docker-compose pull
		docker-compose up --build -d &
		test_opla_up
		if [ -z "$NON_INTERACTIVE" ]; then
			open_browser "http://$(opla_domain)/"
		fi
		echo "Application has started. Too see logs, you can do :"
		echo ""
		echo "cd opla-ce"
		echo "docker-compose logs -f"
		echo ""
		echo ""
	fi

}

# Now that we know the whole script has downloaded, run it.
_ "$0" "$@"
