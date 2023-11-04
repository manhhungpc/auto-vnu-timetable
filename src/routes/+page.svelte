<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileDropzone, Stepper, Step } from '@skeletonlabs/skeleton';
	import Loading from 'src/components/Loading.svelte';
	import { scheduleData } from 'src/utils/store';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let uploading = false,
		isDownloadReady = false,
		error = '',
		autoUpload = false,
		showTutorial = true;
	let lastSyncDate: string = '--/--/--';

	async function uploadFile(e: Event) {
		//@ts-ignore
		const pdfFile = e.target.files[0];
		uploading = true;

		const formData = new FormData();
		formData.append('pdfFile', pdfFile);

		const responseData = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});
		const res = await responseData.json();

		uploading = false;
		if (res.status == 200) {
			isDownloadReady = true;
			scheduleData.set(res.data);
		} else {
			error = res.err;
		}

		if (autoUpload) {
			completeProcess();
		}
	}

	function completeProcess() {
		goto('/result');
	}

	onMount(async () => {
		const sync = await fetch('/api/sync', {
			method: 'GET'
		});

		const syncInfo = await sync.json();
		lastSyncDate = new Date(syncInfo.data.updated_at).toLocaleDateString('vi');
	});
</script>

<div class="main">
	<h1 class="h1">Tool tự động tạo thời khóa biểu</h1>
	<a href="/sync-dsdk" class="link my-4 text-lg">
		Cập nhật dữ liệu từ web dangkyhoc gần nhất: {lastSyncDate}
	</a>

	<div class="intro">
		<h3 class="h3 text-warning-400 mb-2">Mục đích sử dụng</h3>
		- Version dễ hiểu:
		<a
			class="link"
			target="_blank"
			href="https://github.com/manhhungpc/auto-vnu-timetable#auto-vnu-timetable---t%E1%BA%A1o-th%E1%BB%9Di-kh%C3%B3a-bi%E1%BB%83u-vnu-t%E1%BB%B1-%C4%91%E1%BB%99ng"
		>
			TL;DR
		</a>
		<p>
			- Version dài dòng: Tool được tạo ra để trực quan hóa thời khóa biểu (từ file pdf sang excel),
			giúp các bạn sinh viên dễ dàng nắm được lịch học tập. Trong file excel bao gồm các thông tin
			như: Tên môn học, thời gian học, số tiết, giảng đường, tên giảng viên ...
		</p>

		<div class="flex justify-between items-center w-full">
			<h3 class="h3 text-warning-400 mt-5 mb-2">Hướng dẫn lấy file thời khóa biểu</h3>
			<button class="hover:underline" on:click={() => (showTutorial = !showTutorial)}>
				<span>{showTutorial ? 'Ẩn bớt' : 'Hiển thị'}</span>
				<i class="fa-solid {showTutorial ? 'fa-angle-up' : 'fa-angle-down'}" />
			</button>
		</div>
	</div>

	{#if showTutorial}
		<div class="steps bg-surface-800" transition:slide>
			<Stepper
				stepTerm="Bước"
				buttonBackLabel="← Trước"
				buttonNextLabel="Tiếp →"
				buttonCompleteLabel="Xong!"
				class="w-full"
				on:complete={completeProcess}
			>
				<Step class="w-full px-3">
					<svelte:fragment slot="header">Lấy kết quả đăng ký học</svelte:fragment>
					<div class="h-[50vh]">
						Đăng nhập vào dangkyhoc → "In đăng ký học" → "In kết quả"
						<div class="flex justify-center w-full">
							<img src="/img/step-1-get-pdf.png" alt="step-1-get-pdf" class="img-instruct" />
						</div>
					</div>
				</Step>
				<Step class="w-full px-3">
					<svelte:fragment slot="header">Lưu kết quả đăng ký học thành file .pdf.</svelte:fragment>
					<div class="h-[50vh]">
						Ở cửa sổ popup, chọn các tùy chỉnh file pdf giống ảnh sau:
						<div class="flex justify-center w-full">
							<a href="/img/step-2-get-pdf.png" target="_blank" class="hover:cursor-zoom-in">
								<img src="/img/step-2-get-pdf.png" alt="step-2-get-pdf" class="img-instruct" />
							</a>
						</div>
					</div>
				</Step>
				<Step class="w-full px-3">
					<svelte:fragment slot="header">
						Upload/kéo thả file pdf tải xuống vừa rồi vào ô phía dưới
					</svelte:fragment>
					<div class="h-[50vh]">
						<img src="/img/step-3-get-pdf.png" alt="step-3-get-pdf" class="img-instruct" />
					</div>
				</Step>
				<Step class="w-full px-3">
					<svelte:fragment slot="header">
						Ấn nút "Xong!" và chờ đợi mình xử lý nhé
						<i class="fa-solid fa-heart" style="color: #fe251b;" />
					</svelte:fragment>
					<div class="h-[50vh] flex justify-center w-full">
						<img src="/img/quasor.gif" alt="step-4-get-pdf" class="img-instruct" />
					</div>
				</Step>
			</Stepper>
		</div>
	{/if}

	<div class="file-upload">
		<label
			class="w-full flex justify-center space-x-2 my-3 accent-primary-500"
			style:display={isDownloadReady ? 'none' : ''}
		>
			<input
				class="checkbox"
				type="checkbox"
				checked={autoUpload}
				on:change={() => (autoUpload = !autoUpload)}
			/>
			<p>Tự động xử lý khi upload file</p>
		</label>
		{#if uploading}
			<div class="flex items-center justify-center gap-3 text-2xl loading-holder">
				Đang upload và xử lý <Loading />
			</div>
		{:else if isDownloadReady}
			<div class="flex items-center justify-center gap-3 text-2xl loading-holder mt-5">
				Đã xử lý file <i class="fa-regular fa-circle-check fa-xl text-success-600" />
			</div>
		{:else if error}
			<div class="flex items-center justify-center gap-3 text-2xl loading-holder mt-5">
				<i class="fa-regular fa-circle-xmark fa-xl text-error-400" />
				{error} <a href="/feedback" class="link">Báo lỗi ở đây</a>
			</div>
		{:else}
			<FileDropzone name="files" accept="application/pdf" padding="py-16" on:change={uploadFile}>
				<svelte:fragment slot="lead">
					<i class="fa-solid fa-file-arrow-up fa-2xl" />
				</svelte:fragment>
				<svelte:fragment slot="message">
					Tải lên hoặc kéo/thả file kết quả đăng ký môn học
				</svelte:fragment>
				<svelte:fragment slot="meta">Hỗ trợ định dang .pdf</svelte:fragment>
			</FileDropzone>
		{/if}

		{#if !autoUpload}
			<div class="w-full flex justify-center pt-3">
				<button class="btn bg-primary-700" disabled={!isDownloadReady} on:click={completeProcess}>
					Xong!
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.main {
		margin: 25px 0 20px 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.intro {
		max-width: 48rem;
	}

	.steps {
		min-width: 50vw;
		width: 55vw;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.file-upload {
		border-top: 2px solid #ffffff6a;
		width: 55vw;
	}

	.loading-holder {
		width: 55vw;
		padding: 5rem 0;
		background-color: #394770;
		border-radius: 12px;
	}

	.img-instruct {
		width: auto;
		max-height: 48vh;
		padding-top: 0.5rem;
	}
</style>
