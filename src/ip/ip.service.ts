import { Injectable } from '@nestjs/common'

@Injectable()
export class IpService {
  getSuggestion(score: number) {
    if (score <= 0 || score > 64) {
      return null
    }
    // 优秀级（总分52-64分，各维度得分占比≥80%）
    if (score >= 52 && score <= 64) {
      return {
        level: '优秀级',
        conclusion:
          '您的IP属于"优质基层劳动者IP"，核心优势是IP人设与基层劳动场景高度绑定、内容运营规范且互动性强，同时具备清晰的变现路径与良好的数据转化能力。',
        suggestion:
          '建议重点推进好物严选合作，拓展IP联名产品开发，借助线下体验场景进一步放大影响力，实现变现规模升级。'
      }
    }
    // 良好级（总分40-51分，3个维度得分占比≥70%，1个维度≥60%）
    else if (score >= 40 && score <= 51) {
      return {
        level: '良好级',
        conclusion:
          '您的IP属于"潜力基层劳动者IP"，已具备清晰的核心身份与内容方向，目标用户基础较好，但在部分维度（如变现尝试、数据转化）存在短板。',
        suggestion:
          '建议优先针对短板优化，例如明确1-2个核心变现路径并落地尝试，同时根据目标用户偏好调整内容风格，提升数据转化效率。'
      }
    }
    // 待提升级（总分28-39分，2个维度得分占比≥60%，2个维度≥50%）
    else if (score >= 28 && score <= 39) {
      return {
        level: '待提升级',
        conclusion:
          '您的IP属于"待优化基层劳动者IP"，核心问题集中在IP定位模糊、内容与基层劳动元素结合不足，或缺乏变现规划。',
        suggestion:
          '建议先明确IP核心标签（如"农资店主-分享种植技巧与优质农资"），强化内容中的基层劳动场景与职业特色，同步学习基层IP变现案例，逐步搭建变现框架。'
      }
    }
    // 基础薄弱级（总分≤27分，多数维度得分占比＜50%）
    else if (score <= 27) {
      return {
        level: '基础薄弱级',
        conclusion:
          '您的IP目前处于"基层IP孵化初期"，尚未形成清晰的定位、稳定的内容节奏与目标用户认知。',
        suggestion:
          '建议从基础环节入手，先绑定明确的基层劳动者身份，固定内容更新频率（如每周2次），聚焦目标用户关注的劳动场景、生活需求输出内容，逐步积累核心粉丝，再推进后续优化与变现。'
      }
    }
    // 异常分数处理
    else {
      return {
        level: '未知等级',
        conclusion: '无法识别的评分范围',
        suggestion: '请提供有效的评分（0-64分）'
      }
    }
  }
}
