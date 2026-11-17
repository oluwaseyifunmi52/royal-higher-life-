const { exec } = require('child_process');
exec('cd "C:\\Users\\USER\\OneDrive\\Desktop\\Royal higherlife react" && npm run build', (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error.message);
        console.error('stderr:', stderr);
        process.exit(1);
    }
    console.log('stdout:', stdout);
    process.exit(0);
});