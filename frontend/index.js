
Vue.component('post', {
    template: `
        <div @click="run()" class="codeCard">
            <img :src="image" alt="">
            <div>
                <span>{{title}}</span>
            </div>
        </div>
    `,
    props:[
        'title','image'
    ],
    methods:{
        run: function(){
            vm.show = true;
        }
    }
})

data = {
    code : null
}

Vue.component('box', {
    template: `
    <div class="tt">
        <div class="editor">
                 <div class="tools">
                    <span class="fa fa-play float-left" @click="run()"></span>
                    <span class="fa fa-close float-right" @click="hide()"></span> 

                </div>

                <textarea name="" id="" cols="30" v-model="code" rows="10"></textarea>   
                <div style="color:#ffff;">Results :</div> 
                <textarea name="" id="" cols="30" v-model="result" rows="10"></textarea>    
        </div>
        <div style="color:green;">
            {{result}}
        </div>
    </div>
    `,
    created: function(){
        console.log(this.enable);
    },
    methods:{
        hide: function(){
            vm.show = false;
        },
        computed: {
            code: function(){
                return this.code;
            }
        },
        run: function(){
            axios.post('http://localhost:3000/run',{code: this.code}).then(function(result){
                vm.result = result.data;
            });
        }
    },
    data:function(){
        return{
            code :`          #include <stdio.h>
            void main(){
                int i;
                printf("Hello World");
            }`
        }
    },
    props:[
        'enable','result'
    ]
})

var vm = new Vue({
    el: '#root',
    data: {
        user: null,
        posts: [],
        result: null,
        query: null,
        code: `#include <stdio.h>
void main(){
    int i;
    printf("Hello World");
}`,
        show:false,
    },
    mounted:function(){
        this.load();
    },
    methods:{
        load: function(){
            if(!localStorage.getItem('user')){
                NProgress.start();
                axios.post('http://localhost:3000/auth',{}).then(function(res){
                    NProgress.done();
                    localStorage.setItem('user',JSON.stringify(res.data));
                    vm.user = res.data;
                    vm.loadPosts(res.data.id);
                })
                .catch(function(error){
                    NProgress.done();
                    console.log(error);
                })
            }else{
                this.user = JSON.parse(localStorage.getItem('user'));
                this.loadPosts(this.user.id);  
            }

        },
        loadPosts: function(userId){
            NProgress.start();
                axios.post('http://localhost:3000/languages',{}).then(function(res){
                    NProgress.done();
                    vm.posts = res.data;
                })
                .catch(function(error){
                    NProgress.done();
                    console.log(error);
                })
        },
        search: function(e){
            axios.post('http://localhost:3000/search',{key: this.query}).then(function(result){
                vm.posts = result.data;
            });
        },
        getState:function(){
            return runCode;
        },
        logout: function(){
            localStorage.clear();
            location.reload();
        },
        add: function(){
            //input
            var post = {title: '' , code: ''}
            this.posts.push(post);
        }
        
    }
})
