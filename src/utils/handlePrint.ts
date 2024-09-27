import { $, Signal } from '@builder.io/qwik';

export const handlePrint = $((ref: Signal<HTMLElement | undefined>) => {
	const printContent = ref.value;
	if (printContent) {
		const originalContents = document.body.innerHTML;

		printContent
			.querySelectorAll('.hide-on-pdf-download')
			.forEach((el) => el.classList.add('hidden'));
		printContent.querySelectorAll('.brickly-logo-pdf-download')[0].classList.remove('hidden');

		document.body.innerHTML = printContent.innerHTML;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
	}
});
