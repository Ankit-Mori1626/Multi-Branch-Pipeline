pipeline {
    agent { label "Multibranch" }

    environment {
        APP_NAME = "multi-branch-app"
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

        // 3. AGAR TEST BRANCH HAI -> QA Environment Deployment
        stage('Deploy to QA (Test Branch)') {
            when { branch 'Test' }
            steps {
                echo "🚀 Deploying ${env.APP_NAME} to QA Server..."
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
                // sh 'docker build -t myapp:staging . && docker run ...'
                echo "Notifying QA team for UAT testing."
            }
        }

        // 5. AGAR MAIN BRANCH HAI -> Live Production Deployment
        stage('Deploy to Production (Main Branch)') {
            when { branch 'main' }
            steps {
                echo "🚨 ALERT: Deploying ${env.APP_NAME} to LIVE PRODUCTION..."
                // sh './deploy_prod.sh'
                echo "Deployment successfully live on production port 3000!"
            }
        }
    }

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
