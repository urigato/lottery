const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lottery-game';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

// 연결 상태 모니터링
mongoose.connection.on('connected', () => {
  console.log('MongoDB 연결됨');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 오류:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 연결 해제됨');
});

// 프로세스 종료 시 MongoDB 연결 해제
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB 연결이 정상적으로 종료되었습니다.');
  process.exit(0);
});

module.exports = connectDB; 