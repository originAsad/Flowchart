<template>
	<div id="header">

		<el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="/"></el-menu-item>
			<el-submenu index="2">
				<template slot="title">FlowChart</template>
			
			</el-submenu>
			<el-menu-item index="/flowchart">flowchart</el-menu-item>
		</el-menu>
	</div>
</template>


<script>
export default {
  name: "MyHeader",
  data() {
    return {
    };
  },
  mounted() {
    console.log();
    
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
