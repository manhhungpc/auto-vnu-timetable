<script lang="ts">
	import { goto } from '$app/navigation';
	import { FileDropzone, Stepper, Step } from '@skeletonlabs/skeleton';
	import Loading from 'src/components/Loading.svelte';
	import { scheduleData } from 'src/utils/store';
	import { slide } from 'svelte/transition';

	let uploading = false,
		lastSyncDate = new Date().toLocaleDateString('en-GB'),
		autoUpload = false,
		showTutorial = true;

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
		scheduleData.set(res.data);

		if (autoUpload) {
			completeProcess();
		}
	}

	function completeProcess() {
		goto('/result');
	}
</script>

<div class="main">
	<h1 class="h1">Tool auto tạo thời khóa biểu <i class="fa-regular fa-calendar-days" /></h1>
	<p>Cập nhật dữ liệu từ web dangkyhoc lần cuối vào {lastSyncDate}</p>
	<div class="intro">
		<h3 class="h3 text-warning-400 mt-5 mb-2">Mục đích sử dụng</h3>
		<p>
			Tool được tạo ra nhằm hỗ trợ trực quan hóa thời khóa biểu (từ file pdf sang excel), giúp các
			bạn sinh viên dễ dàng nắm được lịch học tập. Trong file excel bao gồm các thông tin như: tên
			môn học, thời gian học, số tiết, giảng đường, tên giảng viên ...
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
				<Step class="w-[55vw]">
					<svelte:fragment slot="header">Lấy kết quả đăng ký học</svelte:fragment>
					<div class="h-[50vh]">
						Đăng nhập vào dangkyhoc → "In đăng ký học" → "In kết quả"
						<div class="flex justify-center w-full">
							<img src="/img/step-1-get-pdf.png" alt="step-1-get-pdf" class="h-[48vh] pt-2" />
						</div>
					</div>
				</Step>
				<Step class="w-[55vw]">
					<svelte:fragment slot="header">Lưu kết quả đăng ký học thành file .pdf.</svelte:fragment>
					<div class="h-[50vh]">
						Ở cửa sổ popup, chọn các tùy chỉnh file pdf giống ảnh sau:
						<div class="flex justify-center w-full">
							<a href="/img/step-2-get-pdf.png" target="_blank" class="hover:cursor-zoom-in">
								<img src="/img/step-2-get-pdf.png" alt="step-2-get-pdf" class="h-[48vh] pt-2" />
							</a>
						</div>
					</div>
				</Step>
				<Step class="w-[55vw]">
					<svelte:fragment slot="header">
						Upload/kéo thả file pdf tải xuống vừa rồi vào ô phía dưới
					</svelte:fragment>
					<div class="h-[50vh]">
						<img src="/img/step-3-get-pdf.png" alt="step-3-get-pdf" class="h-[48vh] pt-2" />
					</div>
				</Step>
				<Step class="w-[55vw]">
					<svelte:fragment slot="header">
						Ấn nút "Xong!" và chờ đợi mình xử lý nhé <i
							class="fa-solid fa-heart"
							style="color: #fe251b;"
						/>
					</svelte:fragment>
					<div class="h-[50vh] flex justify-center w-full">
						<img src="/img/quasor.gif" alt="step-4-get-pdf" class="h-[48vh] pt-2" />
					</div>
				</Step>
			</Stepper>
		</div>
	{/if}

	<div class="file-upload">
		{#if uploading}
			<div class="flex items-center justify-center gap-3 text-2xl loading-holder">
				Đang upload và xử lý <Loading />
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
		<label class="w-full flex justify-center space-x-2 mt-3 accent-primary-500">
			<input
				class="checkbox"
				type="checkbox"
				checked={autoUpload}
				on:change={() => (autoUpload = !autoUpload)}
			/>
			<p>Tự động xử lý khi upload file</p>
		</label>
		{#if !autoUpload}
			<div class="w-full flex justify-center pt-3">
				<button class="btn bg-primary-700" on:click={completeProcess}>Xong!</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.main {
		margin: 20px 0 60px 0;
		width: 100%;
		/* height: 60vh; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.intro {
		max-width: 48rem;
	}

	.steps {
		min-width: 48rem;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.file-upload {
		width: 55vw;
	}

	.loading-holder {
		width: 55vw;
		padding: 5rem 0;
		background-color: #394770;
		border-radius: 12px;
	}
</style>
