<template>
    <v-toolbar style="box-shadow: none; border: 1px solid #e3e2e2; margin-bottom: 5px;" :Class="showselectedversion">
        <p>
            
            <span>{{ version.Name }}</span>
            <br>
            <span style="font-size: 14px; color: grey;">{{ version.Created }}</span>
        </p>
        <v-spacer></v-spacer>
        <div style="display: flex; flex-direction: column;">
            <v-btn small style="box-shadow: none; border-radius: 18px; padding:2px 10px; justify-content: center;" :Class="StatusColor">
                <span style="font-size: 12px;">{{ version.State }}</span>
            </v-btn>

            <v-btn v-if="showcompareBtn" x-small @click="selectVersionForComparision" :Class="selectedversionStatus" style="margin-top: 10px;">
                <span style="font-size: 12px; text-transform: lowercase;">Select for Comapare</span>
            </v-btn>
        </div>
    </v-toolbar>

</template>

<script>
import { mapWritableState } from 'pinia';
import { useCounterStore } from '@/store';
export default {
    name: 'VersionCard',
    data() {
        return {
            // Isversionseleceted: false
        }
    },
    props: [
        "version",
        "SelectedVersionid"
    ],
    methods: {
        selectVersionForComparision() {
    
              this.Isversionseleceted={
                id:this.version.id,
                toshow:true
              }

            
            this.selectedVersionListforcomparision=[];
            // this.Isversionseleceted = false;
            this.selectedVersionListforcomparision.push(this.version);
            console.log("selectedVersionListforcomparision",this.selectedVersionListforcomparision);
            // if(this.version.id){
            //     this.Isversionseleceted = true;
            // }
            
        }
    },
    computed: {
        ...mapWritableState(useCounterStore, ['showcompareBtn','selectedVersionListforcomparision','Isversionseleceted']),
        StatusColor() {
            if (this.version.State == "Approved") {
                return "ActiveStatus";
            } else if (this.version.State == "In Review") {
                return "InreviewStatus";
            } else if (this.version.State == "Draft") {
                return "DraftStatus";
            }
            return ""
        },
        showselectedversion() {
            if (this.version.id == this.SelectedVersionid) {
                return "selectedversionstate";
            }
            return "";
        },
        selectedversionStatus() {
            if (this.Isversionseleceted.toshow == true && this.Isversionseleceted.id===this.version.id ) {
                return "selectedversionbtn";
            }else if(this.version.id == this.SelectedVersionid){
                return "hiddenselectedversionbtn";
            }
            return "unselectedversionbtn";
        }

    },
    created(){
        console.log("showcompareBtn",this.showcompareBtn)
    }
}
</script>
<style>
.ActiveStatus {
    background-color: #C2EDCF;
}

.InreviewStatus {
    background-color: #FFF8EA;
}

.DraftStatus {
    background-color: #8ac5ff;
}

.selectedversionstate {
    background-color: #EBECF1;
}

.selectedversionbtn {
    background-color: #1976d2;
    color: white;
    padding: 5px 10px;
    border-radius: 18px;
}

.unselectedversionbtn {
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #e3e2e2;
}
.hiddenselectedversionbtn{
    display: none;
}
</style>