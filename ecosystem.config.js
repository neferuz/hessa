module.exports = {
    apps: [
        {
            name: 'hessa-backend',
            cwd: './backend',
            script: 'uvicorn',
            args: 'app.main:app --host 0.0.0.0 --port 8000',
            interpreter: 'python3',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'hessa-bot',
            cwd: './backend',
            script: 'bot.py',
            interpreter: 'python3',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'hessa-webapp',
            cwd: './webapp',
            script: 'npm',
            args: 'run start',
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
            },
        },
        {
            name: 'hessa-client',
            cwd: './frontend-client',
            script: 'npm',
            args: 'run start',
            env: {
                PORT: 3001,
                NODE_ENV: 'production',
            },
        },
        {
            name: 'hessa-admin',
            cwd: './square-ui-master',
            script: 'npm',
            args: 'run start',
            env: {
                PORT: 3002,
                NODE_ENV: 'production',
            },
        },
    ],
};
