pipeline {
  agent any
  triggers { pollSCM('H/2 * * * *') }
  environment {
    CLEAN_VOLUMES = "${params.CLEAN_VOLUMES ?: false}"
  }
  parameters {
    booleanParam(name: 'CLEAN_VOLUMES', defaultValue: false, description: 'Run docker compose down -v to reset DB')
    string(name: 'API_HOST', defaultValue: 'http://localhost:3001', description: 'Frontend build-time API host')
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Prepare .env') {
      steps {
        sh '''
          cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-rootpassword}
MYSQL_DATABASE=users_db
MYSQL_USER=users_user
MYSQL_PASSWORD=${MYSQL_PASSWORD:-users_pass}
MYSQL_PORT=3306
DB_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
FRONTEND_PORT=3000
API_HOST=${API_HOST}
EOF
        '''
      }
    }
    stage('Compose config') {
      steps { sh 'docker compose config' }
    }
    stage('Deploy') {
      steps {
        sh 'docker compose down'
        script {
          if (env.CLEAN_VOLUMES == 'true') {
            sh 'docker compose down -v || true'
          }
        }
        sh 'docker compose build --no-cache'
        sh 'docker compose up -d'
      }
    }
    stage('Health check') {
      steps {
        sh 'sleep 8'
        sh 'curl -f http://localhost:3001/health'
        sh 'curl -f http://localhost:3001/users'
      }
    }
  }
  post {
    success {
      echo 'Deployment OK'
      sh 'docker compose ps'
    }
    failure {
      sh 'docker compose logs --no-color || true'
    }
  }
}
