

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    const controlPointRadius = 5;
    let controlPoints = [];
    let isDragging = false;
    let selectedPointIndex = null;

    controlPoints.push({ x: 100, y: 250 });
    controlPoints.push({ x: 200, y: 100 });
    controlPoints.push({ x: 400, y: 100 });
    controlPoints.push({ x: 500, y: 250 });

    function getSelectedPointIndex(mousePos) {
        for (let i = 0; i < controlPoints.length; i++) {
            const point = controlPoints[i];
            const distance = Math.sqrt(Math.pow(point.x - mousePos.x, 2) + Math.pow(point.y - mousePos.y, 2));
            if (distance < controlPointRadius * 2) return i;
        }
        return null;
    }

    function checkDragging(e) {
        let mousePos = getMousePos(canvas, e);
        selectedPointIndex = getSelectedPointIndex(mousePos);

        if (selectedPointIndex !== null) {
            isDragging = true;
        }
    }

    function movePoint(e) {
        if (!isDragging) return;
        let mousePos = getMousePos(canvas, e);

        controlPoints[selectedPointIndex] = mousePos;
        draw();
    }

    function dropPoint(e) {
        isDragging = false;
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function drawCurve() {
        ctx.beginPath();
        ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
        let P0 = controlPoints[0];
        let P1 = controlPoints[1];
        let P2 = controlPoints[2];
        let P3 = controlPoints[3];
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
        ctx.stroke();
    }

    function drawControlPoint(point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, controlPointRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }

    function draw() {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCurve();
        controlPoints.forEach(point => drawControlPoint(point));
    }

    canvas.addEventListener('mousedown', checkDragging);
    canvas.addEventListener('mouseup', dropPoint);
    canvas.addEventListener('mousemove', movePoint);

    draw();
});