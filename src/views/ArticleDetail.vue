<template>
    <div class="article-detail">
        <div class="article-container">
            <!-- 返回按钮 -->
            <div class="back-nav">
                <button @click="goBack" class="back-btn">
                    ← 返回首页
                </button>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading">
                <p>正在加载文章...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="error">
                <h2>{{ error }}</h2>
                <button @click="goBack" class="back-btn">返回首页</button>
            </div>

            <!-- 文章内容 -->
            <article class="article-content" v-else-if="article">
                <!-- 文章头部 -->
                <header class="article-header">
                    <div class="article-cover">
                        <img :src="article.cover" :alt="article.title" />
                    </div>
                    <div class="article-meta">
                        <h1 class="article-title">{{ article.title }}</h1>
                        <div class="article-info">
                            <span class="date">{{ formatDate(article.date) }}</span>
                            <div class="tags">
                                <span v-for="tag in article.tags" :key="tag" class="tag">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                        <div class="article-extra-info" v-if="article.author || article.readTime">
                            <span v-if="article.author" class="author">作者: {{ article.author }}</span>
                            <span v-if="article.readTime" class="read-time">阅读时间: {{ article.readTime }}</span>
                        </div>
                    </div>
                </header>

                <!-- 文章正文 -->
                <div class="article-body">
                    <div v-html="renderedContent" class="markdown-content"></div>
                </div>
            </article>

            <!-- 文章不存在提示 -->
            <div v-else class="not-found">
                <h2>文章未找到</h2>
                <p>抱歉，您要查看的文章不存在。</p>
                <button @click="goBack" class="back-btn">返回首页</button>
            </div>
        </div>
    </div>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { getArticleById } from '../services/dataService.js'

export default {
    name: 'ArticleDetail',
    props: ['id'],
    data() {
        return {
            article: null,
            loading: true,
            error: null
        }
    },
    computed: {
        renderedContent() {
            if (!this.article || !this.article.content) return ''

            // 配置marked
            marked.setOptions({
                highlight: function (code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value
                        } catch (err) { }
                    }
                    return hljs.highlightAuto(code).value
                },
                breaks: true,
                gfm: true
            })

            return marked(this.article.content)
        }
    },
    async mounted() {
        await this.loadArticle()
    },
    watch: {
        async id() {
            await this.loadArticle()
        }
    },
    methods: {
        async loadArticle() {
            try {
                this.loading = true
                this.error = null

                const article = await getArticleById(this.id)

                if (article) {
                    this.article = article
                } else {
                    this.article = null
                    this.error = '文章未找到'
                }
            } catch (error) {
                console.error('加载文章失败:', error)
                this.article = null
                this.error = '加载文章失败，请刷新重试'
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
        goBack() {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.article-detail {
    min-height: 100vh;
    padding: 40px 0;
}

.article-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.back-nav {
    margin-bottom: 30px;
}

.back-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    color: #667eea;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.loading,
.error {
    text-align: center;
    padding: 60px 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.loading p {
    color: #667eea;
    font-size: 1.2rem;
}

.error h2 {
    color: #e53e3e;
    margin-bottom: 15px;
    font-size: 1.8rem;
}

.article-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.article-header {
    position: relative;
}

.article-cover {
    width: 100%;
    height: 300px;
    overflow: hidden;
}

.article-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.article-meta {
    padding: 40px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
    color: white;
}

.article-title {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 20px;
    line-height: 1.2;
}

.article-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 15px;
}

.article-extra-info {
    display: flex;
    gap: 20px;
    font-size: 0.85rem;
    opacity: 0.9;
}

.tags {
    display: flex;
    gap: 10px;
}

.tag {
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.article-body {
    padding: 50px;
}

.not-found {
    text-align: center;
    padding: 60px 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 2rem;
}

.not-found p {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .article-container {
        padding: 0 15px;
    }

    .article-title {
        font-size: 2rem;
    }

    .article-meta {
        padding: 30px;
    }

    .article-body {
        padding: 30px;
    }

    .article-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .article-extra-info {
        flex-direction: column;
        gap: 8px;
    }
}
</style>