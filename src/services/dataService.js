// 数据服务 - 从静态文件加载文章数据

/**
 * 获取文章列表
 * @returns {Promise<Array>} 文章列表
 */
export async function getArticles() {
    try {
        const response = await fetch('/data/articles.json')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.articles || []
    } catch (error) {
        console.error('获取文章列表失败:', error)
        return []
    }
}

/**
 * 获取博客配置
 * @returns {Promise<Object>} 博客配置
 */
export async function getBlogConfig() {
    try {
        const response = await fetch('/data/articles.json')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.config || {}
    } catch (error) {
        console.error('获取博客配置失败:', error)
        return {}
    }
}

/**
 * 根据ID获取文章
 * @param {number} id - 文章ID
 * @returns {Promise<Object|null>} 文章对象
 */
export async function getArticleById(id) {
    try {
        const articles = await getArticles()
        const article = articles.find(item => item.id === parseInt(id))

        if (!article) {
            return null
        }

        // 加载文章内容
        const content = await getArticleContent(article.filename)

        return {
            ...article,
            content
        }
    } catch (error) {
        console.error('获取文章失败:', error)
        return null
    }
}

/**
 * 获取文章内容 (Markdown)
 * @param {string} filename - 文件名
 * @returns {Promise<string>} 文章内容
 */
export async function getArticleContent(filename) {
    try {
        const response = await fetch(`/articles/${filename}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.text()
    } catch (error) {
        console.error('获取文章内容失败:', error)
        return '# 文章加载失败\n\n抱歉，无法加载文章内容。'
    }
}

/**
 * 根据标签筛选文章
 * @param {string} tag - 标签名
 * @returns {Promise<Array>} 筛选后的文章列表
 */
export async function getArticlesByTag(tag) {
    try {
        const articles = await getArticles()
        return articles.filter(article =>
            article.tags && article.tags.includes(tag)
        )
    } catch (error) {
        console.error('根据标签筛选文章失败:', error)
        return []
    }
}

/**
 * 搜索文章
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchArticles(keyword) {
    try {
        const articles = await getArticles()
        const lowerKeyword = keyword.toLowerCase()

        return articles.filter(article =>
            article.title.toLowerCase().includes(lowerKeyword) ||
            article.excerpt.toLowerCase().includes(lowerKeyword) ||
            (article.tags && article.tags.some(tag =>
                tag.toLowerCase().includes(lowerKeyword)
            ))
        )
    } catch (error) {
        console.error('搜索文章失败:', error)
        return []
    }
}

/**
 * 获取所有标签
 * @returns {Promise<Array>} 标签列表
 */
export async function getAllTags() {
    try {
        const articles = await getArticles()
        const tagSet = new Set()

        articles.forEach(article => {
            if (article.tags) {
                article.tags.forEach(tag => tagSet.add(tag))
            }
        })

        return Array.from(tagSet)
    } catch (error) {
        console.error('获取标签列表失败:', error)
        return []
    }
}

/**
 * 获取最新文章
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} 最新文章列表
 */
export async function getLatestArticles(limit = 5) {
    try {
        const articles = await getArticles()
        return articles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
    } catch (error) {
        console.error('获取最新文章失败:', error)
        return []
    }
} 