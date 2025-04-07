<template>
    <v-toolbar style="box-shadow: none; border: 1px solid #e3e2e2; margin-bottom: 5px;">
        <!-- {{ version }} -->
        <p>
            <span>{{ version.Name }}</span>
            <br>
            <span style="font-size: 14px; color: grey;">{{ version.Created }}</span>
        </p>
        <v-spacer></v-spacer>
        <v-btn small style="box-shadow: none; border-radius: 18px; padding:2px 10px;" :Class="StatusColor" >
            <span style="font-size: 12px;">{{ version.State }}</span>
        </v-btn>
    </v-toolbar>
</template>

<script>

export default {
    name: 'VersionCard',
    props: [
        "version"
    ],
    computed: {
        StatusColor() {
            if (this.version.State == "Approved") {
                return "ActiveStatus";
            }else if(this.version.State == "In Review") {
                return "InreviewStatus";
            }else if(this.version.State == "Draft") {
                return "DraftStatus";
            }
            return ""
        }
    }
}
</script>
<style>
.ActiveStatus {
    background-color: #C2EDCF;
}
.InreviewStatus{
    background-color: #FFF8EA;
}
.DraftStatus{
    background-color: #8ac5ff;
}
</style>