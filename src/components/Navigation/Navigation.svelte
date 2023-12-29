<script lang="ts">
    import {HardDrive, Home, MessageSquare, PhoneCall, Settings, Users} from "./index";

    interface NavIcon {
        name: string;
        icon: any;
        active?: boolean;
        toggle?: boolean;
    }

    const navIcons: NavIcon[] = [
        {
            name: 'home',
            icon: Home,
            active: true,
        },
        {
            name: 'message',
            icon: MessageSquare,
        },
        {
            name: 'phone',
            icon: PhoneCall,
        },
        {
            name: 'hard-drive',
            icon: HardDrive,
        },
        {
            name: 'users',
            icon: Users,
        },
        {
            name: 'settings',
            icon: Settings,
        }
    ];
    export let active: string;
</script>
<div class="left-side">
    <div class="navigation">
        {#each navIcons as navIcon}
            <div class="nav-link icon" on:click={(e)=>{active =e.currentTarget.id}}
                 class:active={navIcon.name===active}
                 id={navIcon.name}>
                <svelte:component this={navIcon.icon}/>
            </div>
        {/each}
    </div>
</div>

<style>

    .left-side {
        position: relative;
        padding: 16px;
        flex-basis: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .navigation {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 24px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    }

    .nav-link + .nav-link {
        margin-top: 32px;
    }

    .icon {
        width: 24px;
        height: 24px;
        color: #b1b1b1;
        transition: 0.2s ease-in-out;
    }

    .icon.active {
        color: #3d42df;
    }


    @media screen and (max-width: 768px) {
        .left-side {
            padding: 0;
            flex-basis: 80px;
        }

        .navigation {
            padding: 16px;
        }

        .nav-link + .nav-link {
            margin-top: 16px;
        }

        .toggle {
            display: block;
        }

        .navigation.active {
            display: none;
        }
    }

    @media screen and (max-width: 480px) {
        .left-side {
            flex-basis: 60px;
        }

        .navigation {
            padding: 8px;
        }

        .nav-link + .nav-link {
            margin-top: 8px;
        }
    }


</style>