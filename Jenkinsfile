pipeline {
    agent none
    environment {
        APP_NAME = "multi-branch-app"
        IMAGE_NAME = "multibranchapp"
        PROD_PORT = "3000"
        DEV_PORT = "3001"
        NOTIFY_EMAIL = "ankitmori2323@gmail.com"
    }

    stages {
        // 1. Checkout aur Changes Dikhana
        stage('Checkout & Show Changes') {
            agent any
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
            agent any
            steps {
                echo "Installing packages and running tests..."
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            agent any
            steps {
                echo "Building Docker Image for ${env.BRANCH_NAME}..."
                sh "docker build -t ${env.IMAGE_NAME}:${env.BRANCH_NAME} ."
            }
        }
        stage('Deploy to Staging (Develop Branch)') {
            when { branch 'develop' }
            agent { label 'dev' }
            steps {
                echo "🚀 Deploying ${env.APP_NAME} to Staging Server..."
                sh "docker rm -f app-dev-container || true"
                sh "docker run -d -p ${env.DEV_PORT}:${env.DEV_PORT} -e PORT=${env.DEV_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-dev-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                // sh 'docker build -t myapp:staging . && docker run ...'
                echo "Notifying QA team for UAT testing."
            }
        }

        // 5. AGAR MAIN BRANCH HAI -> Live Production Deployment
        stage('Deploy to Production (Main Branch)') {
            when { branch 'main' }
            agent { label 'prod' }
            steps {
                echo "🚨 ALERT: Deploying ${env.APP_NAME} to LIVE PRODUCTION..."
                sh "docker rm -f app-prod-container || true"
                sh "docker run -d -p ${env.PROD_PORT}:${env.PROD_PORT} -e PORT=${env.PROD_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-prod-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                // sh './deploy_prod.sh'
                echo "Deployment successfully live on production port 3000!"
            }
        }
    }
    post {
        success {
            emailext (
                subject: "✅ SUCCESS: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: """<h3>Jenkins Build Successful!</h3>
                         <p><b>Branch:</b> ${env.BRANCH_NAME}</p>
                         <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                         <p><b>Console Logs:</b> <a href='${env.BUILD_URL}'>Yahan Click Karein</a></p>
                         <p>Status: Deployment complete ho gaya hai.</p>""",
                to: "${env.NOTIFY_EMAIL}",
                from: "ankitmori2323@gmail.com",
                replyTo: "no-reply@yourdomain.com",
                mimeType: 'text/html'
            )
        }
        
        failure {
            emailext (
                subject: "❌ FAILED: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: """<h3>Jenkins Build FAILED!</h3>
                         <p style='color:red;'><b>Branch:</b> ${env.BRANCH_NAME} par build fail ho gayi hai.</p>
                         <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                         <p><b>Check Error Logs Here:</b> <a href='${env.BUILD_URL}console'>Console Output</a></p>""",
                to: "${env.NOTIFY_EMAIL}",
                from: "ankitmori2323@gmail.com",
                replyTo: "no-reply@yourdomain.com",
                mimeType: 'text/html'
            )
        }
    }
}
