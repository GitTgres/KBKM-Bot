echo url="https://www.duckdns.org/update?domains=$1&token=$2&ip=$3" | curl -k -o ${GITHUB_WORKSPACE}/hetzner_server_management/create_server/scripts/duck.log -K -