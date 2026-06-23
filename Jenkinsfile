pipeline {
    agent { label "Multibranch" }

    environment {
        APP_NAME = "multi-branch-app"
        IMAGE_NAME = "multibranchapp"

        PROD_PORT = "3000"
        DEV_PORT = "3001"
        TEST_PORT = "3002"
    }

    stages {
        // 1. Checkout aur Changes Dikhana
        stage('Checkout & Show Changes') {
            steps {
                echo "=== Pulling code for branch: ${env.BRANCH_NAME} ==="
                checkout scm
                
                // Yeh command Jenkins console output me changes dikhayegi
                echo "--- Latest Commit Details ---"
                sh 'git log -1 --stat'
                
                echo "--- Modified Files ---"
                sh 'git diff-tree --no-commit-id --name-only -r HEAD'
            }
        }

        // 2. Dependencies Install karna aur Testing (Sabhi branches ke liye)
        stage('Install & Test') {
            steps {
                echo "Installing packages and running tests..."
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker Image for ${env.BRANCH_NAME}..."
                sh "docker build -t ${env.IMAGE_NAME}:${env.BRANCH_NAME} ."
            }
        }

        // 3. AGAR TEST BRANCH HAI -> QA Environment Deployment
        stage('Deploy to QA (Test Branch)') {
            when { branch 'Test' }
            steps {
                echo "🚀 Deploying ${env.APP_NAME} to QA Server..."
                sh "docker run -d -p ${env.TEST_PORT}:${env.TEST_PORT} -e PORT=${env.TEST_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-test-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}" 
                // Example deployment commands:
                // sh 'scp -r . user@qa-server:/var/www/app'
                echo "Running QA Automation Sanity Tests..."
            }
        }

        // 4. AGAR DEVELOP BRANCH HAI -> Staging Environment Deployment
        stage('Deploy to Staging (Develop Branch)') {
            when { branch 'develop' }
            steps {
                echo "🚀 Deploying ${env.APP_NAME} to Staging Server..."
                sh "docker run -d -p ${env.DEV_PORT}:${env.DEV_PORT} -e PORT=${env.DEV_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-dev-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                // sh 'docker build -t myapp:staging . && docker run ...'
                echo "Notifying QA team for UAT testing."
            }
        }

        // 5. AGAR MAIN BRANCH HAI -> Live Production Deployment
        stage('Deploy to Production (Main Branch)') {
            when { branch 'main' }
            steps {
                echo "🚨 ALERT: Deploying ${env.APP_NAME} to LIVE PRODUCTION..."
                sh "docker run -d -p ${env.PROD_PORT}:${env.PROD_PORT} -e PORT=${env.PROD_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-prod-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                // sh './deploy_prod.sh'
                echo "Deployment successfully live on production port 3000!"
            }
        }
    }
##This is Comment Section
    post {
        always {
            echo "Pipeline finished execution for branch: ${env.BRANCH_NAME}"
        }
        success {
            echo "✅ Build SUCCESS for branch ${env.BRANCH_NAME}."
        }
        failure {
            echo "❌ Build FAILED for branch ${env.BRANCH_NAME}. Please check Git changes."
        }
    }
}
