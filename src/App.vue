<template>
<div class="ignd">
    <div class="ignd-week">
        <button @click="prev()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
            </button>
        <div>{{localize("week")}} {{weekNumber}} {{days[0].format("DD/MM")}} - {{days[days.length-1].format("DD/MM")}}</div>
        <button @click="next()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg>
        </button>
    </div>
    <div class="ignd-heading">
        <div class="ignd-settings" @click="toggleSettingsPanel()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 12.645v-2.289c-1.17-.417-1.907-.533-2.28-1.431-.373-.9.07-1.512.6-2.625l-1.618-1.619c-1.105.525-1.723.974-2.626.6-.9-.374-1.017-1.117-1.431-2.281h-2.29c-.412 1.158-.53 1.907-1.431 2.28h-.001c-.9.374-1.51-.07-2.625-.6l-1.617 1.619c.527 1.11.973 1.724.6 2.625-.375.901-1.123 1.019-2.281 1.431v2.289c1.155.412 1.907.531 2.28 1.431.376.908-.081 1.534-.6 2.625l1.618 1.619c1.107-.525 1.724-.974 2.625-.6h.001c.9.373 1.018 1.118 1.431 2.28h2.289c.412-1.158.53-1.905 1.437-2.282h.001c.894-.372 1.501.071 2.619.602l1.618-1.619c-.525-1.107-.974-1.723-.601-2.625.374-.899 1.126-1.019 2.282-1.43zm-8.5 1.689c-1.564 0-2.833-1.269-2.833-2.834s1.269-2.834 2.833-2.834 2.833 1.269 2.833 2.834-1.269 2.834-2.833 2.834zm15.5 4.205v-1.077c-.55-.196-.897-.251-1.073-.673-.176-.424.033-.711.282-1.236l-.762-.762c-.52.248-.811.458-1.235.283-.424-.175-.479-.525-.674-1.073h-1.076c-.194.545-.25.897-.674 1.073-.424.176-.711-.033-1.235-.283l-.762.762c.248.523.458.812.282 1.236-.176.424-.528.479-1.073.673v1.077c.544.193.897.25 1.073.673.177.427-.038.722-.282 1.236l.762.762c.521-.248.812-.458 1.235-.283.424.175.479.526.674 1.073h1.076c.194-.545.25-.897.676-1.074h.001c.421-.175.706.034 1.232.284l.762-.762c-.247-.521-.458-.812-.282-1.235s.529-.481 1.073-.674zm-4 .794c-.736 0-1.333-.597-1.333-1.333s.597-1.333 1.333-1.333 1.333.597 1.333 1.333-.597 1.333-1.333 1.333z"/></svg>
        </div>
        <div class="ignd-days">
            <div :for="(day,index) in days" :key="index">
                <div class="ignd-day">
                    {{day.format("DD/MM/YY")}}
                </div>
                <div class="ignd-group">
                    <div :for="(group,index) in columns" :key="index">
                        {{group}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ignd-body">
        <div class="ignd-time-labels">
            <div class="ignd-hour" :for="(slot,index) in rows" :key="index" :style="{height: rowHeight + 'px' }">
                {{slot.label}}
            </div>  
        </div>
        <div id="ignd-container">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" :width="columnWidth" :height="rowHeight" patternUnits="userSpaceOnUse">
                        <path :d="pathcode" fill="none" stroke="gray" stroke-width="0.5"/>
                    </pattern>
                </defs>

                <rect :width="boardWidth" :height="boardHeight" fill="url(#grid)" @mousemove="boardHover($event)" />
                <rect class="ignd-hover" :width="columnWidth" :height="rowHeight" :x="hoverX" :y="hoverY" @click="dayHourClick($event)" />
            </svg>
            <div class="ignd-timepicker" :style="{'top':hoverY+'px','left':(hoverX+66)+'px','margin-left':((columnWidth-300)/2)+'px','display':(showTimePicker)?'flex':'none'}">
                <div @click="createEvent(0)">00</div>
                <div @click="createEvent(5)">05</div>
                <div @click="createEvent(10)">10</div>
                <div @click="createEvent(15)">15</div>
                <div @click="createEvent(20)">20</div>
                <div @click="createEvent(25)">25</div>
                <div @click="createEvent(30)">30</div>
                <div @click="createEvent(35)">35</div>
                <div @click="createEvent(40)">40</div>
                <div @click="createEvent(45)">45</div>
                <div @click="createEvent(50)">50</div>
                <div @click="createEvent(55)">55</div>
            </div>
            <div class="ignd-event" :for="(event,index) in visibleEvents" :key="index" :style="{'top':event.top+'px','left':event.left+'px', 'width':columnWidth+'px', 'height':event.height+'px', 'background-color':event.color}">
                <div class="heading">{{event.from|dateToShortTime}} - {{event.to|dateToShortTime}}</div>
                <div class="title">{{event.title}}</div>
            </div>
        </div>
    </div>
    <div class="ignd-settings-panel" :style="{'display':((showSettings)?'block':'none')}">
        <h3>{{localize('calendario_settings')}}</h3>
        <h4></h4>
        <div>
            <label>{{localize('interval')}}</label>
            <label><input type="range" min="0" max="23" v-model="mintime" class="slider">{{(mintime+":00")}}</label>
            <label><input type="range" min="1" max="24" v-model="maxtime" class="slider">{{(maxtime+":00")}}</label>
        </div>
    </div>
</div>
</template>
<style scoped>
/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
.ignd{
    position: relative;
    height: 100%;
    width:100%;
}
.ignd div,
.ignd rect{
    box-sizing: border-box;
}
.ignd-event{
    position:absolute;
    font-size: 11px;
    border: thin solid gray;
    border-radius: 6px;
    padding:6px;
}
.ignd-heading,
.ignd-body{
    position:relative;
    display: flex;
    width:100%;
    text-align: center;
}
.ignd-body .ignd-time-labels{
    width: 66px;
    flex-shrink:0;
    text-align: center;
    font-size: 14px;
}
.ignd-body .ignd-time-labels .ignd-hour{
    padding: 4px;
    border: thin solid #ddd;
    background-color: #eee;
}
.ignd-body #ignd-container{
    width:100%;
}
.ignd-body #ignd-container .ignd-timepicker{
    position: absolute;
    left:-1000px;
    top:-1000px;
    height:30px;
    width: 300px;
    margin-top:-30px;
    justify-content:stretch;
    padding: 4px;
    border: 1px solid gray;
    background-color: white;
}
.ignd-body #ignd-container .ignd-timepicker > div{
    padding:2px 4px;
    margin:2px;
    background-color: #385f87;
    color:white;
    font-size: 12px;
    cursor:pointer;
}
.ignd-body #ignd-container .ignd-timepicker > div:hover{
    background-color: #3C6085;
}
.ignd-heading > .ignd-settings{
    width: 66px;
    line-height: 80px;
    flex-shrink:0;
    height: 80px;
    border: thin solid #ddd;
}
.ignd-heading > .ignd-settings:hover{
    border: 1px solid #999;
    background-color: #ddd;
    cursor: pointer;
}
.ignd-settings-panel{
    position:absolute;
    top:120px;
    left:0px;
    right:0px;
    margin:1px;
    border: thin solid gray;
    border-radius: 4px;
    padding:10px;
    background-color: white;
}
.ignd-heading > .ignd-days{
    position: relative;
    display: flex;
    justify-content: space-around;
    width:100%;
}
.ignd-week{
    position: relative;
    display: flex;
    justify-content: space-around;
    width:100%;
    height: 40px;
    line-height: 40px;
}
.ignd-week button{
    width:100%;
    background-color:#eee;
    flex-shrink: 5;
}
.ignd-week div{
    width:100%;
    text-align: center;
}
.ignd-heading > .ignd-days > div{
    position: relative;
    width:100%;
}
.ignd-heading > .ignd-days .ignd-day{
    height: 40px;
    border: thin solid #ddd;
    line-height: 37px;
}
.ignd-heading > .ignd-days .ignd-group{
    position: relative;
    display: flex;
    justify-content: space-around;
    width:100%;
}
.ignd-heading > .ignd-days .ignd-group > div{
    width:100%;
    border: thin solid #ddd;
    height: 40px;
    line-height: 37px;
}
.ignd-hover{
    fill-opacity: .15;
    stroke: #385f87;
    stroke-width: 2px;
    stroke-dasharray: 2,2;
    cursor: pointer;
    fill: #3C6085;
}
</style>
<script>
import moment from 'moment'
import _ from 'lodash'  

export default {
    name: 'Igenda',
    props: {
        date: Date,
        view: String,
        min_time: Number,
        max_time: Number,
        groups: Array,
        events: Array,
        locale: String
    },
    filters:{
        dateToShortTime: function(date){
            return moment(date).format("HH:mm")
        }
    },
    data: function(){
        return{
            today: moment().format(),
            timeslot: 30, //in minutes
            mintime: 0, //in seconds of a day 
            maxtime: 24, //in seconds of a day
            columnWidth:100,
            rowHeight: 40,
            boardHeight: 0,
            boardWidth: 0,
            hoverX: -1000,
            hoverY:-1000,
            showTimePicker: false,
            showSettings: false,
            tempEventData: {
                hour: 0,
                day:0,
                group:0
            },
            eventInfo: {
                hour: 0,
                day:0,
                group:0,
                minutes:0
            },
            resources:{
                'en':{
                    calendario_settings:"Calendar Settings",
                    interval:"hour interval",
                    week:"week"
                },
                'it':{
                    calendario_settings:"Impostazioni Calendario",
                    interval:"intervallo orari",
                    week:"settimana"
                }
            },
            eventsSource:[]
        }
    },
    watch: {
        mintime: function () {
            if(parseInt(this.mintime) >= parseInt(this.maxtime)){
                this.maxtime = parseInt(this.mintime)+1
            }
            window.localStorage.setItem('mintime',this.mintime)
            this.$emit('minTimeChanged',this.mintime);
            this.calculateGridSize()
            this.positionEvents()
        },
        maxtime: function () {
            if(parseInt(this.maxtime) <= parseInt(this.mintime)){
                this.mintime = parseInt(this.maxtime)-1
            }
            window.localStorage.setItem('maxtime',this.maxtime)
            this.$emit('maxTimeChanged',this.maxtime);
            this.calculateGridSize()
            this.positionEvents()
        }
    },
    computed:{
        weekNumber: function(){
            return moment(this.days[0]).week();
        },
        rowsN:function(){
            return this.maxtime-this.mintime
        },
        columnsN:function(){
            return this.days.length*this.columns.length
        },
        rows:function(){
            var rows = []
            for(var i=0; i<this.rowsN; i++){
                var hour = parseInt(this.mintime)+i
                rows.push({label:(((hour<10)?"0"+hour:hour)+":00"),value:hour})
            }
            return rows;
        },
        columns:function(){
            var columns = ['AZ']
            if(this.groups!=undefined){
                columns = this.groups
            }
            return columns
        },
        days:function(){
            switch(this.view){
                case "WorkWeek":
                    return [
                        moment(this.today).startOf("week"),
                        moment(this.today).startOf("week").add(1,"days"),
                        moment(this.today).startOf("week").add(2,"days"),
                        moment(this.today).startOf("week").add(3,"days"),
                        moment(this.today).startOf("week").add(4,"days")
                        ]
                case "Day":
                    return [moment(this.today)]
                case "Week":
                default:
                    return [
                        moment(this.today).startOf("week"),
                        moment(this.today).startOf("week").add(1,"days"),
                        moment(this.today).startOf("week").add(2,"days"),
                        moment(this.today).startOf("week").add(3,"days"),
                        moment(this.today).startOf("week").add(4,"days"),
                        moment(this.today).startOf("week").add(5,"days"),
                        moment(this.today).startOf("week").add(6,"days")
                        ]
            }
        },
        pathcode:function(){
            return "M"+this.columnWidth+" 0 L 0 0 0 "+this.rowHeight
        },
        visibleEvents: function(){
            this.positionEvents()
            var result = _.filter(this.eventsSource,function(e){ 
                return moment(e.from)
                        .isAfter(
                            moment(this.days[0]).startOf('day')
                            ) 
                        && 
                        moment(e.to)
                        .isBefore(
                            moment(this.days[this.days.length-1]).endOf('day')
                            ) 
                        &&
                            moment(e.to)
                            .diff(moment(e.to).startOf('day')
                            ,'hour'
                            ) > this.mintime
                        &&
                            moment(e.from)
                            .diff(moment(e.from).startOf('day')
                            ,'hour'
                            ) < this.maxtime
                }.bind(this)
                )
            return result;
        }
    },
    created: function(){
        if(this.locale!=undefined){
            moment.locale(this.locale)
        }
    },
    mounted:function(){
        if(this.events!=undefined){
            this.eventsSource = this.events
        }
        if(this.date!=undefined){
            this.today=moment(this.date).format()
        }
        if(window.localStorage.getItem('mintime')!=null){
            this.mintime = window.localStorage.getItem('mintime')
        }else{
            if(this.min_time!=undefined){
                    this.mintime=this.min_time
            }
        }
        if(window.localStorage.getItem('maxtime')!=null){
            this.maxtime = window.localStorage.getItem('maxtime')
        }else{
            if(this.max_time!=undefined){
                    this.maxtime=this.max_time
            }
        }
        this.rowHeight = ((this.$el.clientHeight-120)/this.rowsN)
        this.calculateGridSize()
        this.rowHeight = this.rowHeight-2
        window.addEventListener('resize',function(){
            this.calculateGridSize()
            this.positionEvents()
        }.bind(this))
        this.positionEvents()
    },
    methods:{
        prev: function(){
            if(this.view!='Day')
                this.today = moment(this.today).add(-1,'week')
            else
                this.today = moment(this.today).add(-1,'day')
        },
        next: function(){
            if(this.view!='Day')
                this.today = moment(this.today).add(1,'week')
            else
                this.today = moment(this.today).add(1,'day')
        },
        localize: function(key){
            if(this.resources[this.locale]!=undefined && this.resources[this.locale][key]!=undefined){
                return this.resources[this.locale][key]
            }else{
                this.resources['en'][key]
            }
        },
        positionEvents:function(){
            for(var i=0; i<this.eventsSource.length; i++){
                this.eventsSource[i].top = this.calculateEventTop(this.eventsSource[i].from)
                this.eventsSource[i].left = this.calculateEventLeft(this.eventsSource[i].from, this.eventsSource[i].group)
                this.eventsSource[i].duration = moment(this.eventsSource[i].to).diff(this.eventsSource[i].from,'minutes')
                this.eventsSource[i].height = this.calculateEventHeight(this.eventsSource[i].duration)
            }
        },
        calculateEventTop: function(from){
            return ((moment(from).diff(moment(from).startOf('day'),'seconds') - (this.mintime*3600)) / ((this.maxtime*3600)-(this.mintime*3600)))*(this.rowHeight*this.rows.length)
        },
        calculateEventLeft: function(from,group){
            var left = 66;
            var distance = Math.floor(moment(from).diff(this.days[0],'days'))
            for(var i=0; i<this.columns.length; i++){
                if(this.columns[i]==group){
                    left = left + (distance * this.columns.length * this.columnWidth) + (i * this.columnWidth)
                }
            }
            return left;
        },
        calculateEventHeight: function(duration){
            return this.rowHeight*(duration/60)
        },
        calculateGridSize:function(){
            this.boardHeight = this.$el.clientHeight-120
            this.boardWidth = this.$el.clientWidth-66   
            this.columnWidth = (this.boardWidth/this.columnsN)  
            this.rowHeight = (this.boardHeight/this.rowsN)   
            this.hoverX = -1000;
            this.hoverY = -1000;
        },
        boardHover:function(){
            this.showTimePicker = false
            var newX = event.layerX-66
            var newY = event.layerY
            var offsetX = newX % this.columnWidth
            var offsetY = newY % this.rowHeight
            this.hoverX = newX-offsetX
            this.hoverY = newY-offsetY
            this.tempEventData.hour = Math.floor(newY / this.rowHeight)
            this.tempEventData.day = Math.floor(newX / (this.columnWidth * this.columns.length))
            this.tempEventData.group = Math.floor(Math.floor(newX % (this.columnWidth * this.columns.length)) / this.columnWidth)
        },
        dayHourClick: function(){
            this.eventInfo.hour = this.rows[this.tempEventData.hour].value
            this.eventInfo.day = this.days[this.tempEventData.day]
            this.eventInfo.group = this.columns[this.tempEventData.group]
            this.showTimePicker = !this.showTimePicker
        },
        createEvent: function(minutes){
            this.eventInfo.minutes = minutes
            this.showTimePicker = !this.showTimePicker
            this.$emit('dayHourClicked',this.eventInfo)
        },
        toggleSettingsPanel: function(){
            this.showSettings=!this.showSettings;
        }
    }
}
</script>