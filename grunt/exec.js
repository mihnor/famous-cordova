/**
 * Created by cleliodpaula on 17/8/14.
 */
// Copies remaining files to places other tasks can use
module.exports = {
    native: {
        cmd: 'cordova build ios',
        cwd: 'app-cordova',
        stdout: true,
        stderr: true
    },
    runapp: {
        cmd: 'cordova run ios',
        cwd: 'app-cordova',
        stdout: true,
        stderr: true
    }
};