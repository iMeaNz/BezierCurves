let enableBezier = false;

const toggleButton = document.getElementById('toggleBezier');
const bezierStatus = document.getElementById('bezierStatus');

toggleButton.addEventListener('click', function() {
    enableBezier = !enableBezier;
    bezierStatus.textContent = enableBezier;
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    let painting = false;
    let points = [];

    function startPainting(e) {
        painting = true;
        points.push(getMousePos(canvas, e));
        draw(e);
    }

    function stopPainting() {
        painting = false;
        points = [];
        ctx.beginPath();
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getMidpoint(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };
    }

    function calculateControlPoints(points) {
        let controlPoints = [points[0]];

        for (let i = 1; i < points.length - 1; i++) {
            let mid1 = getMidpoint(points[i - 1], points[i]);
            let mid2 = getMidpoint(points[i], points[i + 1]);

            controlPoints.push(mid1);
            controlPoints.push(points[i]);
            controlPoints.push(mid2);
        }

        controlPoints.push(points[points.length - 1]);
        return controlPoints;
    }

    function drawCurve() {
        if (points.length < 3) return;

        let controlPoints = calculateControlPoints(points);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < controlPoints.length - 3; i += 3) {
            let P0 = controlPoints[i];
            let P1 = controlPoints[i + 1];
            let P2 = controlPoints[i + 2];
            let P3 = controlPoints[i + 3];

            for (let t = 0; t <= 1; t += 0.01) {
                let x = (1 - t) * (1 - t) * (1 - t) * P0.x +
                        3 * (1 - t) * (1 - t) * t * P1.x +
                        3 * (1 - t) * t * t * P2.x +
                        t * t * t * P3.x;
                let y = (1 - t) * (1 - t) * (1 - t) * P0.y +
                        3 * (1 - t) * (1 - t) * t * P1.y +
                        3 * (1 - t) * t * t * P2.y +
                        t * t * t * P3.y;

                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';

        let currentPos = getMousePos(canvas, e);
        points.push(currentPos);
        if (enableBezier) {
            drawCurve();
        } else {
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        }
    }

    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mousemove', draw);
});