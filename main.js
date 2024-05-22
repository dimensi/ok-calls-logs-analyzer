(() => {
    const $iFile = document.getElementById('file');
    const $result = document.getElementById('result');

    const $iSearch = document.getElementById('search');

    const $controls = document.getElementById('controls');
    const $controlLevelDebug = document.getElementById('control-debug');
    const $controlLevelLog = document.getElementById('control-log');
    const $controlLevelWarning = document.getElementById('control-warning');
    const $controlLevelError = document.getElementById('control-error');
    const $controlSortAsc = document.getElementById('sort-ask');
    const $controlSortDesk = document.getElementById('sort-desk');

    let currentLog = [];

    $iFile.addEventListener('change', async (e) => {
        const file = $iFile.files[0];
        const content = await file.text();
        currentLog = [];

        try {
            const data = JSON.parse(content);
            $controls.classList.remove('disabled');

            currentLog = data.flat(1);
            drawLog(currentLog);
        } catch (err) {
            $iFile.value = null;
            alert('Не удалось распарсить файл, возможно, он повреждён');
        }
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

    $iSearch.addEventListener('change', () => {
        const text = $iSearch.value.trim().toLowerCase();
        if (!text) {
            drawLog(currentLog);
        } else {
            const words = text.split(' ');

            const log = currentLog.filter((item) => {
                const logStr = JSON.stringify(item.d).toLowerCase();
                for (const word of words) {
                    if (!logStr.includes(word)) {
                        return false;
                    }
                }
                return true;
            });
            drawLog(log);
        }
    });


    function logToString(log, expand = false) {
        return log.map((item) => {
            if (typeof item === 'string' || typeof item === 'number') {
                return item;
            }
            return JSON.stringify(item, null, expand ? 2 : null);
        }).join(' ');
    }

    function drawLine(item) {
        const $line = document.createElement('div');
        $line.className = `line level-${item.l.toLowerCase()}`;

        const $time = document.createElement('div');
        $time.className = 'line-time';
        $time.textContent = item.h;
        $line.appendChild($time);

        const $data = document.createElement('div');
        $data.className = 'line-data';
        $data.textContent = logToString(item.d);
        $line.appendChild($data);

        $line.addEventListener('click', () => {
            const expanded = $line.classList.toggle('wrap');
            $data.textContent = logToString(item.d, expanded);
        });

        $result.appendChild($line);
    }

    function drawLog(log) {
        $result.innerHTML = '';
        for (const item of log) {
            drawLine(item);
        }
    }

})();
