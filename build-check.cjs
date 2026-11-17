const { execSync } = require('child_process');
try {
    const result = execSync('npx vite build --mode production', {
        cwd: 'C:\\Users\\USER\\OneDrive\\Desktop\\Royal higherlife react',
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log('EXIT CODE:', result.status);
    console.log('STDOUT length:', result.stdout?.length);
    console.log('STDOUT start:', result.stdout?.slice(0, 200));
    console.log('STDERR length:', result.stderr?.length);
    console.log('STDERR start:', result.stderr?.slice(0, 200));
} catch (e) {
    console.log('CATCH EXIT CODE:', e.status);
    console.log('CATCH STDOUT:', e.stdout?.slice(0, 2000));
    console.log('CATCH STDERR:', e.stderr?.slice(0, 2000));
}