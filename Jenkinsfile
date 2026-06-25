pipeline{
  agent none
  environment { 
    PROD_PORT = "3000"
    DEV_PORT = "3001"
    IMAGE_NAME = "multiagent"
  }

  stages{
    stage('checkout'){
      agent { label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
            }
      steps {
        checkout scm
      }
    }
    stage('install'){
      agent{
        label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
      }
      steps{
        sh 'npm install'
        sh 'npm test'
      }
    }
    stage('build image'){
      agent{
        label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
      }
      steps{
        sh "docker build -t ${env.IMAGE_NAME}:${env.BRANCH_NAME} ."
      }
    }
    stage('Deploy to dev'){
      when { branch 'develop' }
      agent { label 'dev' }
      steps{
        sh "docker rm -f app-dev-container || true"
        sh "docker run -d -p ${env.DEV_PORT}:${env.DEV_PORT} -e DEV_PORT=${env.DEV_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-dev-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
      }
    }
    stage('Deploy to prod'){
      when { branch 'main' }
      agent { label 'prod' }
      steps{
        sh "docker rm -f app-prod-container || true"
        sh "docker run -d -p ${env.PROD_PORT}:${env.PROD_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-prod-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
      }
    }
  }
}  
