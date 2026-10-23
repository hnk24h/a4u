# Role

Bạn là Senior Fullstack Engineer + Solution Architect.

Hãy thiết kế và triển khai một sản phẩm web tên IT Digest.

Mục tiêu của sản phẩm là thu thập, phân loại, tổng hợp và tóm tắt tin tức công nghệ từ nhiều nguồn khác nhau, chia thành hai khu vực:

🌎 Thế Giới (World)
🇻🇳 Việt Nam (Vietnam)

Người dùng có thể theo dõi nhanh các tin tức IT quan trọng trong ngày hoặc trong tuần mà không cần đọc nhiều website khác nhau.

# Business Goal

Xây dựng một website dạng:

Tech News Aggregator
AI News Summary
Weekly IT Digest

Tập trung vào ngành CNTT và Công nghệ.

Người dùng chỉ cần bỏ ra 5 phút mỗi ngày để nắm được tình hình công nghệ.

# Functional Requirements
1. News Aggregation

Hệ thống phải tự động thu thập tin từ RSS Feed hoặc API.

World Sources
Microsoft Blog
Azure Blog
AWS Blog
Google Cloud Blog
GitHub Blog
OpenAI Blog
Hacker News
TechCrunch
The Verge
Ars Technica
Vietnam Sources
VnExpress Số Hóa
Vietnamnet Công Nghệ
ICTNews
GenK
CafeF Công Nghệ
Dân Trí Công Nghệ
Bộ Khoa học và Công nghệ
NIC
2. News Categories

Tin tức phải được phân loại tự động:

World
AI
Cloud
Security
Development
DevOps
Open Source
Startup
Big Tech
Vietnam
AI Việt Nam
Chuyển đổi số
CNTT Doanh nghiệp
Startup
Chính sách
Viễn thông
An toàn thông tin
3. AI Summarization

Sau khi thu thập bài viết:

AI tạo:

Short Summary

50-100 từ.

Executive Summary

3-5 bullet points.

Ví dụ:

{
  "summary": "...",
  "highlights": [
    "...",
    "...",
    "..."
  ]
}

4. Story Grouping

Các bài báo cùng nói về một sự kiện phải được gom lại.

Ví dụ:

OpenAI ra mắt GPT-X

Nguồn:
- OpenAI
- TechCrunch
- The Verge

AI Summary:
...


Thay vì hiển thị 3 bài riêng lẻ.

5. Ranking

Tính điểm bài viết.

Score dựa trên:

độ mới
số nguồn nhắc tới
mức độ ảnh hưởng
AI relevance score

Ví dụ:

100 = Breaking News
80 = Hot
60 = Important
40 = Normal

6. Daily Digest

Tạo báo cáo:

Top 10 IT News Today


Phân chia:

World
Vietnam
7. Weekly Digest

Mỗi tuần tạo:

Top Technology Events This Week


Bao gồm:

AI
Cloud
Security
Vietnam Technology
8. Trend Analysis

AI phân tích xu hướng.

Ví dụ:

Top Trends This Week

World:
1. AI Agents
2. MCP
3. Coding Assistants

Vietnam:
1. Digital Transformation
2. AI Vietnamese Models
3. Data Centers

9. Search

Cho phép tìm kiếm:

Azure
OpenAI
Kubernetes
Viettel
FPT


Hỗ trợ:

Full-text search
Filter category
Filter date range
10. User Personalization

Người dùng có thể chọn chủ đề yêu thích.

Ví dụ:

{
  "interests": [
    "AI",
    "Azure",
    "Security"
  ]
}


Feed hiển thị theo sở thích.

Non Functional Requirements
Performance
API response < 500ms
Homepage load < 2s
Scalability

Thiết kế cho:

10.000 users
100.000 articles
SEO
SSR
Sitemap
Metadata
OpenGraph
Technical Stack
Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
shadcn/ui
Backend
Next.js API Routes

hoặc

NestJS

Ưu tiên:

Next.js Fullstack

Database

PostgreSQL

ORM

Prisma

Cache

Redis

Job Queue

BullMQ

Authentication

Auth.js

Login:

Google
GitHub
AI Layer

OpenAI API

Tasks:

Summarization
Classification
Trend Analysis
Story Grouping
Database Design
Article
id
title
url
source
region
category
content
summary
score
published_at
created_at

Story
id
title
summary
score
trend_score
region
created_at

StoryArticle
story_id
article_id

User
id
email
name
avatar

UserPreference
user_id
category

Page Structure
Home
🔥 Top News

🌎 World

Top Stories
Latest News
Trending Topics

🇻🇳 Vietnam

Top Stories
Latest News
Trending Topics

Category Page
/ai

/cloud

/security

/devops

Story Detail
Title

AI Summary

Sources

Related Articles

Timeline

Trends Page
Weekly Trends

World Trends

Vietnam Trends

Background Jobs
Every 30 minutes
Fetch RSS
Store Articles

Every hour
Classify News

Generate Summary

Calculate Score

Daily
Generate Daily Digest

Weekly
Generate Weekly Digest

Generate Trend Report

UI Requirements

Thiết kế giống:

TechCrunch
Hacker News
Morning Brew
Google News

Màu sắc:

Primary: #2563EB

World:
Blue

Vietnam:
Red


Phong cách:

Modern
Minimal
Professional
Dark/Light mode
Deliverables
System Architecture Diagram
Database Schema
Prisma Models
API Design
Folder Structure
UI Wireframe
RSS Ingestion Flow
AI Processing Flow
BullMQ Jobs
Complete MVP Implementation Plan
Docker Compose Setup
Production Deployment Guide
CI/CD Pipeline
Testing Strategy

Hãy triển khai theo kiến trúc production-ready, clean architecture, dễ mở rộng và tuân thủ best practices của Next.js, TypeScript, PostgreSQL và Prisma.