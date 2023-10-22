<script lang="ts">
	import { goto } from '$app/navigation';
	import { exportExcel } from '$lib/xlsx';
	import { scheduleData } from 'src/utils/store';
	import { onMount } from 'svelte';

	let downloaded = false;
	async function downloadExcel() {
		try {
			const buffer = await exportExcel($scheduleData);
			const blob = new Blob([buffer]);
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'test_TKB.xlsx';
			a.click();

			URL.revokeObjectURL(url);
		} catch (err) {
			console.log(err);
		}
	}

	onMount(() => {
		if (!$scheduleData.subjects) {
			alert('Nothing here~ We need some data first! :)');
			goto('/');
		}
	});
	$: console.log($scheduleData);
</script>

<main class:blank_page={!$scheduleData.subjects}>
	<button type="button" class="btn variant-filled" on:click={downloadExcel}>
		<span><i class="fa-solid fa-download" /></span>
		<span>File .xlsx sẵn sàng tải về</span>
	</button>
	<a href="/">Home</a>
</main>

<style>
	main {
		padding-top: 12vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.blank_page {
		visibility: hidden;
	}
</style>
