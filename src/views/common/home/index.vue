<template>

  <div class="mod-home">
    <h1>这里什么都没有</h1>

    <h2>技术选型</h2>

    <figure>
      <table
          border="1"
          cellspacing="0"
          cellpadding="5px"
      >
        <thead>
        <tr>
          <th>技术</th>
          <th>版本</th>
          <th>说明</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td>Spring Boot</td>
          <td>3.0.4</td>
          <td>MVC核心框架</td>
        </tr>
        <tr>
          <td>MyBatis</td>
          <td>3.5.0</td>
          <td>ORM框架</td>
        </tr>
        <tr>
          <td>MyBatisPlus</td>
          <td>3.5.3.1</td>
          <td>基于mybatis，使用lambda表达式的</td>
        </tr>
        <tr>
          <td>Swagger-UI</td>
          <td>4.0.0</td>
          <td>文档生产工具</td>
        </tr>
        <tr>
          <td>redisson</td>
          <td>3.19.3</td>
          <td>对redis进行封装、集成分布式锁等</td>
        </tr>
        <tr>
          <td>hikari</td>
          <td>3.2.0</td>
          <td>数据库连接池</td>
        </tr>
        <tr>
          <td>log4j2</td>
          <td>2.17.2</td>
          <td>更快的log日志工具</td>
        </tr>
        <tr>
          <td>lombok</td>
          <td>1.18.8</td>
          <td>简化对象封装工具</td>
        </tr>
        <tr>
          <td>hutool</td>
          <td>5.8.15</td>
          <td>更适合国人的java工具集</td>
        </tr>
        <tr>
          <td>xxl-job</td>
          <td>2.3.1</td>
          <td>定时任务</td>
        </tr>
        </tbody>

      </table>

    </figure>


  </div>

</template>

<style lang="scss" scoped>
.mod-home {
  line-height: 1.5;
}
</style>
