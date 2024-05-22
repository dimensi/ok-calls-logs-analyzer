(() => {
    const $iFile = document.getElementById('file');
    const $result = document.getElementById('result');

    const $controls = document.getElementById('controls');
    const $controlLevelDebug = document.getElementById('control-debug');
    const $controlLevelLog = document.getElementById('control-log');
    const $controlLevelWarning = document.getElementById('control-warning');
    const $controlLevelError = document.getElementById('control-error');
    const $controlSortAsc = document.getElementById('sort-ask');
    const $controlSortDesk = document.getElementById('sort-desk');

    $iFile.addEventListener('change', async (e) => {
        const file = $iFile.files[0];
        const content = await file.text();
        const data = JSON.parse(content);
        console.warn(data);

        $controls.classList.remove('disabled');
        drawLog(data);
    });

    for (const $control of [$controlLevelDebug, $controlLevelLog, $controlLevelWarning, $controlLevelError]) {
        $control.addEventListener('change', () => {
            $result.classList.toggle($control.className, !$control.checked);
        });
    }

    for (const $control of [$controlSortAsc, $controlSortDesk]) {
        $control.addEventListener('change', (e) => {
            $result.classList.toggle('desk', $controlSortDesk.checked);
        });
    }


    function logToString(log) {
        return log.map((item) => {
            if (typeof item === 'string' || typeof item === 'number') {
                return item;
            }
            return JSON.stringify(item);
        }).join(' ');
    }

    function drawLine(item) {
        const text = logToString(item.d);

        const $line = document.createElement('div');
        $line.className = `line level-${item.l.toLowerCase()}`;
        $line.innerHTML = `<div class='line-time'>${item.h}</div>
<div class='line-data'>${text}</div>`

        $line.addEventListener('click', () => {
            $line.classList.toggle('wrap');
        });

        $result.appendChild($line);
    }

    function drawLog(log) {
        for (const item of log) {
            if (Array.isArray(item)) {
                drawLog(item);
            } else {
                drawLine(item);
            }
        }
    }

})();
