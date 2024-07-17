import { $, Signal } from '@builder.io/qwik';

export const handlePrint = $((ref: Signal<HTMLElement | undefined>) => {
	const printContent = ref.value;
	if (printContent) {
		const originalContents = document.body.innerHTML;
		document.body.innerHTML = printContent.innerHTML;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
	}
});
