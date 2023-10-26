<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let lastSyncDate: string;
	let tab: string = 'sync_from_web';
	let fileName: string, description: string, fileData: any, errorMsg: string;

	async function onSyncDsdk() {
		if (!fileName || !fileData) {
			errorMsg = 'Có ô bắt buộc đang để trống!';
		}

		const formData = new FormData();
		formData.append('title', fileName);
		formData.append('description', description);
		formData.append('dsdk', fileData[0]);

		const responseData = await fetch('/api/sync', {
			method: 'POST',
			body: formData
		});
		const res = await responseData.json();
	}

	onMount(async () => {
		const sync = await fetch('/api/sync', {
			method: 'GET'
		});

		const syncInfo = await sync.json();
		lastSyncDate = new Date(syncInfo.data.updated_at).toLocaleDateString('vi');
	});
</script>

<main class="flex flex-col items-center pt-4">
	<h2 class="h2">
		Xem và cập nhật dữ liệu thời khóa biểu mới nhất từ
		<a href="https://dangkyhoc.vnu.edu.vn/dang-nhap" class="link">dangkyhoc</a>
	</h2>

	<p>Được cập nhật lần cuối vào {lastSyncDate}</p>

	<div class="intro">
		<p class="leading-relaxed mt-3 p-3 rounded-md bg-surface-700 text-primary-500">
			<i class="fa-solid fa-circle-info fa-lg" />
			Từ dữ liệu file pdf bạn gửi lên, tool chỉ có thể lấy được các lớp được liệt kê trong file. Đôi
			khi, thời khóa biểu từ file pdf sẽ thiếu 1 số lớp lý thuyết/thực hành nên tool cần phải lấy toàn
			bộ dữ liệu về thời khóa biểu môn học/lớp học/giảng viên, tránh thiếu sót lớp trong lúc xử lý.
		</p>
		<h3 class="h3 text-warning-400 mt-3">1. Những lưu ý khi cập nhật dữ liệu</h3>
		<ul>
			<li>
				- Chỉ cập nhật dữ liệu mới khi thời gian đồng bộ cuối CHƯA phải thời gian của học kỳ hiện
				tại
			</li>
			<li>- Nên cập nhật lại dữ liệu khi có thay đổi về lịch học trong lúc web dangkyhoc vẫn mở</li>
			<li>
				- Kiểm tra trạng thái cập nhật tại đây. Bạn cũng chỉ nên cập nhật khi chưa có ai gửi dữ liệu
				lên, tránh quá tải server 😵
			</li>
		</ul>
		<h3 class="h3 text-warning-400 mt-3">2. Hướng dẫn cập nhật dữ liệu</h3>
	</div>
	<div class="update-instruct">
		<TabGroup>
			<Tab bind:group={tab} name="tab1" value="sync_from_web">
				<span>Với web</span>
			</Tab>
			<Tab bind:group={tab} name="tab2" value="sync_with_extension">
				<span>Với chrome extension</span>
			</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if tab === 'sync_from_web'}
					<ol class="list max-w-3xl">
						<li>
							<span>1.</span>
							<span class="flex-auto">
								Đăng nhập vào trang
								<a href="https://dangkyhoc.vnu.edu.vn/dang-nhap" class="link">dangkyhoc</a>
								<i class="fa-solid fa-right-long mx-1" /> Đăng ký môn học
								<i class="fa-solid fa-right-long mx-1" /> Đăng ký học ngành 1
							</span>
						</li>
						<div class="w-full">
							<img src="/img/sync-dsdk-1.png" alt="step-1" />
						</div>

						<li>
							<span>2.</span>
							<span class="flex-auto">
								Lưu trang bằng cách nhấn Ctrl + S hoặc chuột phải
								<i class="fa-solid fa-right-long mx-1" /> Save as ...
							</span>
						</li>
						<li>
							<span>3.</span>
							<span class="flex-auto"> Điền thông tin vào form dưới và ấn "Gửi" </span>
						</li>
						<div class="bg-surface-600 rounded-md p-3">
							<label class="label mt-3">
								<span>Tên file</span>
								<span class="text-red-500">*</span>
								<input
									class="input px-3 py-1"
									type="text"
									placeholder="VD: HK1_2023-2024"
									bind:value={fileName}
								/>
							</label>
							<label class="label mt-3">
								<span>Mô tả</span>
								<input class="input px-3 py-1" type="text" bind:value={description} />
							</label>
							<div class="label mt-3">
								<span>File HTML (.html) ở bước trên</span>
								<span class="text-red-500">*</span>
								<input class="input" type="file" bind:files={fileData} />
							</div>
							<div class="w-full flex justify-end">
								<button type="button" class="btn bg-primary-500 mt-3" on:click={onSyncDsdk}>
									Gửi
								</button>
							</div>
						</div>
					</ol>
				{:else if tab === 'sync_with_extension'}
					<div class="max-w-2xl">Đang thi công</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</main>

<style>
	.intro {
		width: 48rem;
		/* padding-top: 5rem; */
	}

	.update-instruct {
		padding-bottom: 3.5rem;
		max-width: 48rem;
		width: 100%;
	}

	li {
		margin-top: 10px !important;
	}
</style>
