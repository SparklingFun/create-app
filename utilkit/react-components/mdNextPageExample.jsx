import React from 'react'
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { NextSeo } from 'next-seo';
import Disqus from 'disqus-react';
// Components
import CodeHighlight from '../components/_markdown/CodeHighlight'
import ShareComponent from '../components/common/share'
import Link from 'next/link';

// TOC
import MarkdownNavbar from 'markdown-navbar'

export default class extends React.Component {
    static async getInitialProps({ query }) {
        const post = await import(`../posts/${decodeURIComponent(query.id)}.md`);
        const document = matter(post.default);
        return {
            content: document.content,
            data: document.data,
            isEmpty: document.isEmpty,
            excerpt: document.excerpt,
            id: query.id,
        };
    }

    constructor() {
        super()
        this.state = {
            disqusConfigUrl: ''
        }
    }

    componentDidMount() {
        this.setState({
            disqusConfigUrl: window.location.href
        })
    }

    render() {
        const disqusShortname = 'sparking-app-blog'
        const disqusConfig = {
            identifier: this.props.data.title,
            title: this.props.data.title,
        }
        return (
            <article>
                <NextSeo
                    title={this.props.data.title}
                    titleTemplate='🍋柠檬汽水 | %s'
                    description='SparkingLemon的个人博客'
                    canonical={'https://blog.sparking.app/post?id=' + encodeURIComponent(this.props.id)}
                    twitter={{
                        cardType: 'summary',
                        site: '@site',
                    }}
                    openGraph={{
                        type: 'article',
                        title: '🍋柠檬汽水 | ' + this.props.data.title,
                        description: 'SparkingLemon的个人博客',
                        article: {
                            publishedTime: this.props.data.date,
                            tags: this.props.data.tags,
                        },
                        images: [
                            {
                                url: 'https://blog.sparking.app/images/sparkinglemon-logo.png',
                                width: 527,
                                height: 526,
                                alt: 'SparkingLemon',
                            }
                        ],
                    }}
                />
                {/* Post Title */}
                <h1>{this.props.data.title}</h1>
                {/* Post Tags */}
                <div className="post-tools">
                    <ul className="post-tags">
                        {
                            this.props.data.tags.map((tag) => {
                                return (
                                    <Link href={'/taglist?tag=' + tag} key={tag}>
                                        <li className="inline-block mx-1"><i className="_icon-tag _icon-tag-style"></i><span className="post-tag">{tag}</span></li>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                    <ShareComponent />
                </div>
                {/* Post Markdown renderer */}
                <div className="marked-render">
                    <ReactMarkdown source={this.props.content} renderers={{ code: CodeHighlight }} />
                </div>
                <div className="mt-4">
                    <Disqus.DiscussionEmbed shortname={disqusShortname} config={{ ...disqusConfig, url: this.state.disqusConfigUrl }} />
                </div>
                <div className="marked-navbar" data-spk="post-markdown-navbar">
                    <p>目录：</p>
                    <MarkdownNavbar source={this.props.content} />
                </div>
            </article>
        )
    }
}