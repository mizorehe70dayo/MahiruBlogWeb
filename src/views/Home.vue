<template>
    <div class="home">
        <!-- 顶部标题区域 -->
        <header class="hero-section">
            <div class="container">
                <h1 class="blog-title">MAHIRU的笔记</h1>
                <p class="blog-subtitle">记录生活中的美好瞬间</p>
            </div>
        </header>

        <!-- 主要内容区域 -->
        <main class="main-content">
            <div class="container">
                <!-- 文章网格 -->
                <div class="articles-grid">
                    <article v-for="article in articles" :key="article.id" class="article-card"
                        @click="openArticle(article)">
                        <div class="card-image">
                            <img :src="article.cover" :alt="article.title" />
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">{{ article.title }}</h3>
                            <p class="card-excerpt">{{ article.excerpt }}</p>
                            <div class="card-meta">
                                <span class="date">{{ formatDate(article.date) }}</span>
                                <div class="tags">
                                    <span v-for="tag in article.tags" :key="tag" class="tag">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { getArticles, getBlogConfig } from '../services/dataService.js'

export default {
    name: 'Home',
    data() {
        return {
            articles: [],
            blogConfig: {},
            loading: true,
            error: null
        }
    },
    async mounted() {
        await this.loadData()
    },
    methods: {
        async loadData() {
            try {
                this.loading = true

                // 并行加载文章列表和博客配置
                const [articles, config] = await Promise.all([
                    getArticles(),
                    getBlogConfig()
                ])

                this.articles = articles
                this.blogConfig = config
                this.error = null
            } catch (error) {
                console.error('加载数据失败:', error)
                this.error = '加载失败，请刷新重试'
            } finally {
                this.loading = false
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },

        openArticle(article) {
            this.$router.push({
                name: 'ArticleDetail',
                params: { id: article.id.toString() }
            })
        }
    }
}
</script>