<script lang="ts">
	import '../app.css';
	import { TabGroup, AppBar, TabAnchor } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<svelte:head>
	<title>Tool tự động tạo thời khóa biểu VNU</title>
</svelte:head>
<AppBar class="fixed top-0 left-0 z-10 w-full p-3 h-16 justify-center">
	<svelte:fragment slot="lead" />
	<TabAnchor href="/">
		<span class="brand">VNU Timetable</span>
	</TabAnchor>
	<svelte:fragment slot="trail">
		<TabGroup
			justify="justify-end"
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
			flex="flex-1 lg:flex-none"
			rounded="rounded-md"
			border=""
			class="bg-surface-100-800-token w-full"
		>
			<TabAnchor href="/">
				<span class="link-nav"> <i class="fa-solid fa-house" /> </span>
			</TabAnchor>
			<TabAnchor href="/sync-dsdk">
				<span class="link-nav"> Dữ liệu dangkyhoc </span>
			</TabAnchor>
			<TabAnchor href="/faq">
				<span class="link-nav"> FAQ </span>
			</TabAnchor>
			<TabAnchor href="/feedback">
				<span class="link-nav"> Phản hồi </span>
			</TabAnchor>
			<TabAnchor href="https://github.com/manhhungpc/auto-vnu-timetable">
				<span class="link-nav"> <i class="fa-brands fa-github fa-lg" /> </span>
			</TabAnchor>
		</TabGroup>
	</svelte:fragment>
</AppBar>

<div class="mt-16 overflow-y-auto">
	<slot />
</div>

<style>
	.brand {
		font-size: 24px;
	}
	.link-nav {
		font-size: 16px;
	}
</style>
