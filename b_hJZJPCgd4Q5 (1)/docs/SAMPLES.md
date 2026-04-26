# Sample Inputs and Outputs

## Sample Input 1: Full Stack Engineer JD

### Input (Job Description)

```
Senior Full Stack Engineer

We are looking for an experienced Full Stack Engineer to join our growing team.

Requirements:
- 5+ years of experience in software development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with PostgreSQL and Redis
- Familiarity with AWS services (EC2, S3, Lambda)
- Experience with CI/CD pipelines and Docker
- Strong problem-solving skills

Nice to have:
- Experience with GraphQL
- Knowledge of Kubernetes
- Previous startup experience

Responsibilities:
- Design and implement scalable web applications
- Collaborate with product and design teams
- Mentor junior developers
- Participate in code reviews
- Contribute to architectural decisions
```

### Parsed Output

```json
{
  "title": "Senior Full Stack Engineer",
  "experienceLevel": "Senior",
  "requiredSkills": [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Docker",
    "CI/CD"
  ],
  "preferredSkills": [
    "GraphQL",
    "Kubernetes"
  ],
  "responsibilities": [
    "Design and implement scalable web applications",
    "Collaborate with product and design teams",
    "Mentor junior developers",
    "Code reviews",
    "Architectural decisions"
  ],
  "keywords": [
    "Full Stack",
    "startup",
    "scalable",
    "EC2",
    "S3",
    "Lambda"
  ]
}
```

### Matched Candidates Output

```json
[
  {
    "id": "1",
    "name": "Sarah Chen",
    "currentRole": "Senior Software Engineer",
    "company": "TechCorp Inc.",
    "matchScore": 92,
    "interestScore": 85,
    "combinedScore": 88.5,
    "status": "Engaged",
    "skillMatches": ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
    "skillGaps": ["Redis", "Kubernetes"],
    "matchExplanation": "Strong match with 6/8 required skills. 8 years of experience exceeds the 5+ requirement. Currently actively looking for new opportunities."
  },
  {
    "id": "3",
    "name": "Michael Rodriguez",
    "currentRole": "Full Stack Developer",
    "company": "StartupXYZ",
    "matchScore": 78,
    "interestScore": 72,
    "combinedScore": 75,
    "status": "Interested",
    "skillMatches": ["React", "Node.js", "PostgreSQL", "GraphQL", "Docker"],
    "skillGaps": ["TypeScript", "Redis", "AWS"],
    "matchExplanation": "Good foundation with 5/8 required skills. 5 years experience meets minimum. Has preferred GraphQL experience. Open to opportunities."
  }
]
```

---

## Sample Input 2: Data Engineer JD

### Input (Job Description)

```
Data Engineer - Remote

Join our data team to build robust data pipelines and infrastructure.

Requirements:
- 3+ years experience in data engineering
- Expert in Python and SQL
- Experience with Apache Spark and Airflow
- Knowledge of data warehousing (Snowflake, BigQuery, or Redshift)
- Familiarity with cloud platforms (AWS/GCP/Azure)

Nice to have:
- Experience with Kafka or other streaming platforms
- Knowledge of dbt
- Machine learning pipeline experience

Responsibilities:
- Build and maintain ETL pipelines
- Optimize data warehouse performance
- Collaborate with data scientists
- Ensure data quality and governance
```

### Parsed Output

```json
{
  "title": "Data Engineer",
  "experienceLevel": "Mid-level",
  "requiredSkills": [
    "Python",
    "SQL",
    "Apache Spark",
    "Airflow",
    "Snowflake",
    "BigQuery",
    "Redshift",
    "AWS",
    "GCP",
    "Azure"
  ],
  "preferredSkills": [
    "Kafka",
    "dbt",
    "Machine Learning"
  ],
  "responsibilities": [
    "Build and maintain ETL pipelines",
    "Optimize data warehouse performance",
    "Collaborate with data scientists",
    "Ensure data quality and governance"
  ],
  "keywords": [
    "Data Engineering",
    "Remote",
    "streaming",
    "data pipelines"
  ]
}
```

---

## Sample Conversation Transcript

### Candidate: Sarah Chen (Engaged)

```
AI Agent:
Hi Sarah! I came across your profile and was impressed by your experience at 
TechCorp Inc. We have an exciting Senior Full Stack Engineer opportunity that 
seems like a great match for your React, TypeScript, and Node.js expertise. 
The role involves building scalable web applications and mentoring junior 
developers. Would you be interested in learning more?

Sarah Chen:
Hi! Thanks for reaching out. Yes, I'm actually actively looking for new 
opportunities right now. The tech stack sounds exactly like what I've been 
working with. I'd love to hear more about the team and the types of problems 
you're solving.

AI Agent:
That's great to hear! The team is focused on building next-generation 
e-commerce infrastructure. You'd be working with a small, senior team of 6 
engineers. The role offers competitive compensation, equity, and full remote 
flexibility. What aspects of the role matter most to you?

Sarah Chen:
Remote flexibility is huge for me. I'm also really interested in the 
architectural decision-making aspect you mentioned. At my current role, I 
don't get as much input on high-level design as I'd like. When could we 
schedule a call to discuss further?

AI Agent:
Perfect! I can see this being a great fit. I'll send over some available 
time slots. Before we wrap up, is there anything else you'd like to know 
about the company or role?

Sarah Chen:
Just curious about the interview process and timeline. I'm hoping to make 
a move within the next month or so if possible.
```

**Extracted Interest Signals:**
- "actively looking for new opportunities" (+15)
- "tech stack sounds exactly like what I've been working with" (+10)
- "schedule a call to discuss further" (+15)
- "hoping to make a move within the next month" (+10)

**Interest Score: 85**

---

### Candidate: James Wilson (Declined)

```
AI Agent:
Hi James! I noticed your impressive background in backend systems at 
Enterprise Solutions. We have a Senior Full Stack Engineer role that could 
leverage your Node.js and PostgreSQL expertise. Would you be open to a 
quick conversation about it?

James Wilson:
Thanks for thinking of me. I appreciate the outreach, but I'm actually 
quite happy in my current role. We just got a new CTO who's driving some 
exciting technical initiatives, and I want to see those through.

AI Agent:
That's completely understandable! It sounds like you're in a good place. 
Would you be open to keeping in touch for future opportunities, or perhaps 
know anyone in your network who might be interested?

James Wilson:
Sure, feel free to check back in 6 months or so. As for referrals, I can't 
think of anyone off the top of my head, but I'll keep you in mind if 
someone comes up.
```

**Extracted Interest Signals:**
- "happy in my current role" (-15)
- "want to see those through" (-10)
- "check back in 6 months" (-5)

**Interest Score: 32**

---

## Final Ranked Output Example

| Rank | Candidate | Match | Interest | Combined | Status |
|------|-----------|-------|----------|----------|--------|
| 1 | Sarah Chen | 92 | 85 | 88.5 | Engaged |
| 2 | Emily Watson | 88 | 78 | 83.0 | Interested |
| 3 | Michael Rodriguez | 78 | 72 | 75.0 | Interested |
| 4 | David Kim | 75 | 65 | 70.0 | Interested |
| 5 | James Wilson | 82 | 32 | 57.0 | Declined |

---

## Edge Cases

### Edge Case 1: Minimal JD Input

**Input:**
```
Looking for a developer who knows JavaScript.
```

**Parsed Output:**
```json
{
  "title": "Developer",
  "experienceLevel": "Not specified",
  "requiredSkills": ["JavaScript"],
  "preferredSkills": [],
  "responsibilities": [],
  "keywords": ["developer"]
}
```

### Edge Case 2: No Matching Candidates

When no candidates in the pool have any matching skills:
- System returns empty shortlist
- UI displays message: "No candidates found matching your requirements"
- Suggests broadening search criteria

### Edge Case 3: All Candidates Declined

When matched candidates show no interest:
- System still ranks by combined score
- All candidates shown with "Declined" status
- Recruiter can review conversations to understand objections
