#!/bin/bash

declare -A DEFAULTS_client=(
    ["NG_APP_API_URL"]="http://localhost:8080/api"
)

declare -A DEFAULTS_server=(
    ["DOMAIN"]="localhost"
    ["PORT"]="8080"
    ["FRONTEND_DOMAIN"]="localhost"
    ["FRONTEND_PORT"]="4200"
    ["ENV"]="development"
)

SUBFOLDERS=("client" "server")

# Check if --defaults flag is 
USE_DEFAULTS=false
if [[ "$1" == "--defaults" ]]; then
    USE_DEFAULTS=true
fi

for folder in "${SUBFOLDERS[@]}"; do
    EXAMPLE_FILE="$folder/.env.example"
    ENV_FILE="$folder/.env"

    if [[ ! -f "$EXAMPLE_FILE" ]]; then
        echo "⚠️  No .env.example found in $folder. Skipping..."
        continue
    fi

    if [[ -f "$ENV_FILE" ]]; then
        echo "⏩ .env already exists in $folder. Skipping..."
        continue
    fi

    echo "✅ Creating $ENV_FILE from $EXAMPLE_FILE"

    if [[ "$folder" == "client" ]]; then
        declare -n DEFAULTS=DEFAULTS_client
    elif [[ "$folder" == "server" ]]; then
        declare -n DEFAULTS=DEFAULTS_server
    else
        unset DEFAULTS
    fi

    while IFS= read -r line || [[ -n "$line" ]]; do
        if [[ "$line" =~ ^#.* || -z "$line" ]]; then
            echo "$line" >> "$ENV_FILE"
        else
            key=$(echo "$line" | cut -d '=' -f1)
            value=$(echo "$line" | cut -d '=' -f2-)
            echo $USE_DEFAULTS $DEFAULTS[$key] $value
            if [[ -z "$value" && "$USE_DEFAULTS" = true && -n "${DEFAULTS[$key]}" ]]; then
                echo "$key=${DEFAULTS[$key]}" >> "$ENV_FILE"
            else
                echo "$line" >> "$ENV_FILE"
            fi
        fi
    done < "$EXAMPLE_FILE"

    echo "✅ Processed $ENV_FILE"
done

echo "🎉 All done!"
