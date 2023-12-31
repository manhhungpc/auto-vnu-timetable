<script lang="ts">
	import { TabGroup, Tab, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let lastSyncDate: string = '--/--/--',
		lastPulls: string = '',
		syncStatus: number = 0,
		processing = false;
	let tab: string = 'sync_from_web';
	let fileName: string, description: string, fileData: any, errorMsg: string;
	const statusInfo: PopupSettings = {
		event: 'hover',
		target: 'statusInfo',
		placement: 'right'
	};

	async function onSyncDsdk() {
		if (!fileName || !fileData) {
			errorMsg = 'Có ô bắt buộc đang để trống!';
		}

		processing = true;
		const formData = new FormData();
		formData.append('title', fileName);
		formData.append('description', description);
		formData.append('dsdk', fileData[0]);

		const responseData = await fetch('/api/sync', {
			method: 'POST',
			body: formData
		});

		processing = false;
		const res = await responseData.json();
		if (responseData.status == 200) {
			errorMsg = 'no-error';
			return true;
		} else {
			errorMsg = res.err;
		}
	}

	onMount(async () => {
		const sync = await fetch('/api/sync', {
			method: 'GET'
		});

		const syncInfo = await sync.json();
		lastSyncDate = new Date(syncInfo.data.updated_at).toLocaleDateString('vi');
		lastPulls = syncInfo.data.lastPullDate;
		syncStatus = syncInfo.data.sync_status;
	});
</script>

<main class="flex flex-col items-center pt-4">
	<h2 class="h2">
		Xem và cập nhật dữ liệu thời khóa biểu mới nhất từ
		<a href="https://dangkyhoc.vnu.edu.vn/dang-nhap" class="link">dangkyhoc</a>
	</h2>

	<div class="intro">
		<div class="bg-surface-700 p-3 rounded-md flex justify-evenly">
			<p class="text-lg">
				Cập nhật lần cuối: {lastSyncDate}
				<span class="[&>*]:pointer-events-none" use:popup={statusInfo}>
					{#if syncStatus == 1}
						<i class="fa-regular fa-circle-check text-success-500" />
					{:else if syncStatus == 2}
						<i class="fa-solid fa-triangle-exclamation text-warning-500" />
					{:else if syncStatus == 3}
						<i class="fa-regular fa-circle-xmark text-error-400" />
					{:else}
						<i class="fa-regular fa-circle-question text-surface-400" />
					{/if}
				</span>
			</p>
			<div class="card p-3 variant-filled-surface leading-7" data-popup="statusInfo">
				<p>Trạng thái dữ liệu được đồng bộ với dangkyhoc chia như sau:</p>
				<p class="text-success-500">
					<i class="fa-regular fa-circle-check" /> Tin cậy - Dữ liệu cập nhật gần nhất ít hơn 30 ngày
				</p>
				<p class="text-warning-500">
					<i class="fa-solid fa-triangle-exclamation" /> Chấp nhận được - Dữ liệu cập nhật gần nhất khoảng
					30 - 90 ngày
				</p>
				<p class="text-error-400">
					<i class="fa-regular fa-circle-xmark" /> Sai lệch - Dữ liệu cập nhật gần nhất đã quá 90 ngày,
					cần thay mới
				</p>
			</div>
			<div style="border: 1px  solid #fff" />
			<p class="text-lg">Đang chờ cập nhật: {lastPulls}</p>
		</div>
		<p class="leading-relaxed mt-3 p-3 rounded-md bg-surface-700 text-primary-500">
			<i class="fa-solid fa-circle-info fa-lg" />
			Từ dữ liệu file pdf bạn gửi lên, tool chỉ có thể lấy được các lớp được liệt kê trong file và có
			thể sẽ bị thiếu 1 số lớp lý thuyết/thực hành. Do đó tool cần phải lấy toàn bộ dữ liệu về thời khóa
			biểu môn học/lớp học/giảng viên, tránh thiếu sót lớp trong lúc xử lý.
			<br /><br />
			Rất cảm ơn các bạn mỗi kỳ đều cập nhật danh sách đăng ký học mới !
		</p>
		<h3 class="h3 text-warning-400 mt-3">1. Những lưu ý khi cập nhật dữ liệu</h3>
		<ul>
			<li>
				- Chỉ nên cập nhật dữ liệu mới khi thời gian "Cập nhật lần cuối" và "Đang chờ cập nhật" CHƯA
				phải thời gian của học kỳ hiện tại (tránh ngỏm server 😵).
			</li>
			<li>
				- Nên cập nhật lại dữ liệu khi có thay đổi về lịch học trong lúc web dangkyhoc vẫn mở.
			</li>
			<li>
				- Nếu bạn có bất kỳ thắc mắc nào liên quan, xem mục <a href="/faq" class="link">FAQ</a>
				hoặc <a href="/feedback" class="link">liên hệ mình</a> nhé :))
			</li>
		</ul>
		<h3 class="h3 text-warning-400 mt-3">2. Hướng dẫn cập nhật dữ liệu</h3>
	</div>
	<div class="update-instruct">
		<TabGroup
			regionList="text-surface-400"
			active="text-white border-b-2 border-surface-900-50-token"
		>
			<Tab bind:group={tab} name="tab1" value="sync_from_web">
				<span>Với web</span>
			</Tab>
			<Tab bind:group={tab} name="tab2" value="sync_with_extension">
				<span>Với chrome extension</span>
			</Tab>
			<Tab bind:group={tab} name="tab2" value="sync_with_fork_gh">
				<span>Qua đóng góp trên GitHub</span>
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

						<li class="!items-start">
							<span>2.</span>
							<span class="flex-auto">
								Chọn môn học toàn trường để lấy toàn bộ môn học
								<br />
								Sau đó lưu trang bằng cách nhấn Ctrl + S hoặc chuột phải
								<i class="fa-solid fa-right-long mx-1" /> Save as ...
							</span>
						</li>
						<li>
							<span>3.</span>
							<span class="flex-auto"> Điền thông tin vào form dưới và ấn "Cập nhật" </span>
						</li>
						<div class="bg-surface-600 rounded-md p-3">
							<label class="label">
								<span>Học kỳ</span>
								<span class="text-red-500">*</span>
								<input
									class="input px-3 py-1 rounded-lg"
									type="text"
									placeholder="VD: HK1-2023-2024"
									bind:value={fileName}
								/>
							</label>
							<label class="label mt-3">
								<span>Mô tả</span>
								<input class="input px-3 py-1 rounded-lg" type="text" bind:value={description} />
							</label>
							<div class="label mt-3">
								<span>File HTML (.html) ở bước trên</span>
								<span class="text-red-500">*</span>
								<input class="input rounded-lg" type="file" bind:files={fileData} />
							</div>
							<div class="w-full mb-3 flex justify-end">
								<button type="button" class="btn bg-primary-500 mt-3" on:click={onSyncDsdk}>
									Cập nhật
								</button>
							</div>
							{#if processing}
								<div>
									Đang tạo yêu cầu cập nhật <span class="loading loading-infinity loading-lg" />
								</div>
							{/if}
							{#if errorMsg}
								<div class="text-error-400 text-lg flex justify-end">Có lỗi xảy ra: {errorMsg}</div>
							{:else if errorMsg == 'no-error'}
								<div class="text-success-500 text-lg flex justify-end">
									Tạo yêu cầu cập nhật thành công!
								</div>
							{/if}
						</div>
						<li>
							<span>
								Sau khi gửi thành công, bạn có thể theo dõi trạng thái chờ file cập nhật
								<a href="https://github.com/manhhungpc/auto-vnu-timetable/pulls" class="link">
									trên GitHub này
								</a>
								<br />
								Nếu dữ liệu phù hợp, file bạn gửi sẽ chính thức được sử dụng trong các lần tới của tool
								:&gt;
							</span>
						</li>
					</ol>
				{:else if tab === 'sync_with_extension'}
					<div class="max-w-2xl">Đang thi công</div>
				{:else if tab === 'sync_with_fork_gh'}
					<div class="max-w-2xl">Đang thi công</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</main>

<style>
	.intro {
		margin-top: 30px;
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
