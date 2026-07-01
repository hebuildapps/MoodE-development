export function draggable(node: HTMLElement, header?: HTMLElement) {
	const target = header || node;
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	let initialLeft = 0,
		initialTop = 0;

	function dragMouseDown(e: MouseEvent) {
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;

		const rect = node.getBoundingClientRect();
		initialLeft = rect.left;
		initialTop = rect.top;

		node.style.transform = 'none';

		document.addEventListener('mousemove', elementDrag);
		document.addEventListener('mouseup', closeDragElement);
	}

	function elementDrag(e: MouseEvent) {
		e.preventDefault();
		node.style.left = initialLeft + (e.clientX - pos3) + 'px';
		node.style.top = initialTop + (e.clientY - pos4) + 'px';
	}

	function closeDragElement() {
		document.removeEventListener('mousemove', elementDrag);
		document.removeEventListener('mouseup', closeDragElement);
	}

	target.addEventListener('mousedown', dragMouseDown);

	return {
		destroy() {
			target.removeEventListener('mousedown', dragMouseDown);
			document.removeEventListener('mousemove', elementDrag);
			document.removeEventListener('mouseup', closeDragElement);
		}
	};
}
