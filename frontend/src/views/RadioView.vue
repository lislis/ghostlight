<template>
    <div class="about">
        <div>
            <div class="row row-1">

                <div class="button yellow"></div>
                <div class="slide">
                    <input type="range" min="1" max="4" step="1">
                    <h2>Kanal</h2>
                </div>
                <div class="button blue"></div>
            </div>
            <div class="row row-2">

                <div class="button red"></div>
                <div class="slide">
                    <input type="range" min="1" max="4" step="1">
                    <h2>Sound</h2>
                </div>

                <div class="button green"></div>
            </div>
        </div>
    </div>
</template>
<script>
 export default {
     name: 'RadioView',
     data() {
         return {
             green: false,
             blue: false,
             red: false,
             yellow: false,
         }
     },
     created() {

     }
 }

</script>

<style>
 body {
     background-color: beige;
     color: black;
 }

 .button {
     width: 100px;
     height: 100px;
     border-radius: 50%;
     border: 3px solid black;
 }
 .yellow {
     background-color: gold;
 }
 .red {
     background-color: red;
 }
 .green {
     background-color: green;
 }
 .blue {
     background-color: blue;
 }

 :root {
     --input-thumb-color: darkgrey;
     --input-track-color: darkgrey;
     --input-border-color: black;
     ;
 }

 input[type=range] {
     height: 25px;
     -webkit-appearance: none;
     margin: 10px 0;
     width: 100%;
 }
 input[type=range]:focus {
     outline: none;
 }
 input[type=range]::-webkit-slider-runnable-track {
     width: 100%;
     height: 5px;
     cursor: pointer;
     animate: 0.2s;
     box-shadow: 0px 0px 0px var(--input-border-color);
     background: var(--input-track-color);
     border-radius: 1px;
     border: 0px solid var(--input-border-color);
 }
 input[type=range]::-webkit-slider-thumb {
     box-shadow: 0px 0px 0px var(--input-border-color);
     border: 3px solid var(--input-border-color);
     height: 44px;
     width: 12px;

     background: var(--input-thumb-color);
     cursor: pointer;
     -webkit-appearance: none;
     margin-top: -20px;
 }
 input[type=range]:focus::-webkit-slider-runnable-track {
     background: var(--input-track-color);
 }
 input[type=range]::-moz-range-track {
     width: 100%;
     height: 5px;
     cursor: pointer;
     animate: 0.2s;
     box-shadow: 0px 0px 0px var(--input-border-color);
     background: var(--input-track-color);
     border-radius: 1px;
     border: 0px solid var(--input-border-color);
 }
 input[type=range]::-moz-range-thumb {
     box-shadow: 0px 0px 0px var(--input-border-color);
     border: 1px solid var(--input-track-color);
     height: 30px;
     width: 12px;

     background: var(--input-thumb-color);
     cursor: pointer;
 }
 input[type=range]::-ms-track {
     width: 100%;
     height: 5px;
     cursor: pointer;
     animate: 0.2s;
     background: transparent;
     border-color: transparent;
     color: transparent;
 }
 input[type=range]::-ms-fill-lower {
     background: var(--input-track-color);
     border: 0px solid var(--input-border-color);
     border-radius: 2px;
     box-shadow: 0px 0px 0px var(--input-border-color);
 }
 input[type=range]::-ms-fill-upper {
     background: var(--input-track-color);
     border: 0px solid var(--input-border-color);
     border-radius: 2px;
     box-shadow: 0px 0px 0px var(--input-border-color);
 }
 input[type=range]::-ms-thumb {
     margin-top: 1px;
     box-shadow: 0px 0px 0px var(--input-border-color);
     border: 1px solid var(--input-track-color);
     height: 30px;
     width: 12px;

     background: var(--input-thumb-color);
     cursor: pointer;
 }
 input[type=range]:focus::-ms-fill-lower {
     background: var(--input-track-color);
 }
 input[type=range]:focus::-ms-fill-upper {
     background: var(--input-track-color);
 }

 .row {
     position: relative;
     display: flex;
     justify-content: space-between;
     align-items: center;
     width: 80%;
     margin: auto;
 }
 .row {
     margin-top: 100px;
 }
 .row .slide {
     width: 70%;
 }
 .row-1 {
     margin-top: 200px;
 }

</style>
