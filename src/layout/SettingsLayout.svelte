<script>
    import {colorScheme, SvelteUIProvider, Stack, Switch, Text, Tabs} from '@svelteuidev/core';

    const toggleTheme = () => {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'))
    }
</script>
<div class="p-4 overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100" style="height: 100vh">
    <div class="shadow rounded-lg p-6 ">
        <h1 class="text-xl font-semibold mb-4">Personal Information</h1>
        <p class=" mb-6">Use a permanent address where you can receive mail.</p>
        <form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="First name" class="border p-2 rounded w-full">
                <input type="text" placeholder="Last name" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <input type="email" placeholder="Email address" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <select class="border p-2 rounded w-full">
                    <option>United States</option>
                    <!-- Add more countries as needed -->
                </select>
            </div>
            <div class="mb-4">
                <input type="text" placeholder="Street address" class="border p-2 rounded w-full">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input type="text" placeholder="City" class="border p-2 rounded w-full">
                <input type="text" placeholder="State / Province" class="border p-2 rounded w-full">
                <input type="text" placeholder="ZIP / Postal code" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600"><span
                        class="ml-2 text-gray-700">I agree to the <a href="#"
                                                                     class="underline">privacy policy</a></span>
                </label>
            </div>
            <Switch on:change={toggleTheme} onLabel="dark" offLabel="light"/>
        </form>
    </div>
</div>