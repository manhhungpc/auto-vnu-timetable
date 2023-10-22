<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	let tab: number = 0;
</script>

<main class="flex flex-col items-center">
	<h2 class="h2">Hướng dẫn</h2>
	<div class="max-w-2xl w-full pt-10">
		<TabGroup>
			<Tab bind:group={tab} name="tab1" value={0}>
				<span>Lấy tất cả các lớp trên dangkyhoc</span>
			</Tab>
			<Tab bind:group={tab} name="tab2" value={1}>
				<span>Qua GitHub</span>
			</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if tab === 0}
					<div class="max-w-2xl">
						<p>Hướng dẫn lấy dữ liệu lớp học từ web dangkyhoc</p>
						<ol class="list-dl my-8">
							<li>
								<span>1.</span>
								<span class="flex-auto">
									Đăng nhập vào trang
									<a href="https://dangkyhoc.vnu.edu.vn/dang-nhap" class="link">dangkyhoc</a>
									&#11106; Đăng ký môn học &#11106; Đăng ký học ngành 1
								</span>
							</li>
							<div class="w-full">
								<img src="/img/sync-dsdk-1.png" alt="step-1" />
							</div>

							<li>
								<span>2.</span>
								<span class="flex-auto">
									Lưu trang bằng cách nhấn Ctrl + S hoặc chuột phải &#11106; Save as ...</span
								>
							</li>
							<li>
								<span>3.</span>
								<span class="flex-auto">
									Ấn nút và chờ đợi mình xử lý nhé <i
										class="fa-solid fa-heart"
										style="color: #fe251b;"
									/>
								</span>
							</li>
						</ol>
					</div>
				{:else if tab === 1}
					<div class="max-w-2xl">Some</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</main>
