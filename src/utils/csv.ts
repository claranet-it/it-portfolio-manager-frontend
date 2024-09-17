export const openDownloadCSVDialog = (content: string, fileName: string) => {
	const blob = new Blob([content as unknown as BlobPart], { type: 'text/csv' });
	const a = document.createElement('a');

	a.download = `${fileName}.csv`;
	a.href = URL.createObjectURL(blob);
	a.click();
	setTimeout(() => {
		URL.revokeObjectURL(a.href);
		a.remove();
	}, 200);
};
