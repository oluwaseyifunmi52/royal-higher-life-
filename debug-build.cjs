const { execSync } = require('child_process');
try {
    const result = execSync('npm run build --if-present', {
        cwd: 'C:\\Users\\USER\\OneDrive\\Desktop\\Royal higherlife react',
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log('EXIT CODE:', result.status);
    console.log('STDOUT:', result.stdout?.slice(0, 3000));
    console.log('STDERR:', result.stderr?.slice(0, 3000));
} catch (e) {
    console.log('EXIT CODE:', e.status);
    console.log('STDOUT:', e.stdout?.slice(0, 3000));
    console.log('STDERR:', e.stderr?.slice(0, 3000));
}