# IFU App — Contributor Guide

Hey! Here's a quick rundown of what I've set up for our project and how we can collaborate smoothly going forward.

---

## What I Set Up

I created a **GitHub Project board** to help us coordinate who is working on what. Think of it as a shared Kanban board (like Trello) that lives directly on GitHub and is connected to our codebase.

I've already added 8 features to the board as issues for us to work through:

1. Daily Quiet Time
2. Bible Study Material Directory / E-Learning
3. Bible Knowledge RAG Chatbot
4. EBS Interactive Version
5. Discipleship Steps Tracker
6. User Authentication & Profiles
7. Mobile-Responsive UI
8. Admin Content Management Dashboard

**Project board link:** https://github.com/orgs/IFU-Web-App/projects/1

---

## What Is a GitHub Project?

A GitHub Project is a task board that sits on top of GitHub Issues. Each card on the board represents an issue (a feature, bug, or task). As we work through features, the cards move across columns — from **Todo** to **In Progress** to **Done**.

The key benefit for us: we can each see at a glance what is being worked on and by whom, which means we avoid accidentally building the same thing at the same time.

---

## How Issues Connect to Code

Each issue has a number (e.g. #2 for Daily Quiet Time). When you work on a feature, you tie your code to that number in three ways:

- **Branch name** — name your branch starting with the issue number: `2-daily-quiet-time`
- **Commit messages** — reference the number in commits: `git commit -m "Add scripture reader #2"`
- **Pull Request** — write `Closes #2` in the PR description. When the PR is merged, GitHub automatically closes the issue and moves the card to Done on the board.

This means the board stays up to date with zero manual effort.

---

## The AGENTS.md Update

I've updated the `AGENTS.md` file in your repo. This file is read by your AI coding assistant (Codex, Claude Code, etc.) at the start of every session.

From now on, whenever you open the project in your AI assistant, it will automatically ask you:

> "Would you like to see the open issues on this project so you can pick a feature to work on?"

If you say yes, it will fetch the live list of open issues from GitHub and show them to you. You just pick a number and the AI handles the rest — creating the branch, referencing the issue in commits, and opening the pull request when you're done.

---

## How to Start Working on a Feature (Your Workflow)

Here is the full process, step by step:

### 1. Open the project in your AI assistant
When you load the repo, your AI will ask if you want to see the open issues. Say yes.

### 2. Pick an issue
The AI will show you the list. Tell it which number you want to work on.

### 3. The AI sets up your branch
It will assign the issue to you (so I know you're on it) and create a branch like:
```
2-daily-quiet-time
```

### 4. Build the feature
Work on the code as normal. Your AI will reference the issue number in commit messages automatically.

### 5. Open a Pull Request
When you're done, tell your AI to open a PR. It will write `Closes #2` in the description so the issue closes automatically when I merge it.

### 6. Wait for review
I'll review the PR and merge it. The card on the board will move to Done on its own.

---

## One-Time Setup (if you haven't already)

You need the GitHub CLI installed to run the issue commands:

1. Download it from https://cli.github.com
2. Run `gh auth login` and follow the prompts to connect your GitHub account

That's it — you only need to do this once.

---

## Summary

| What | Where |
|------|-------|
| Project board | https://github.com/orgs/IFU-Web-App/projects/1 |
| Issues list | https://github.com/enochwork123-stack/IFU-app/issues |
| Workflow instructions | `AGENTS.md` in the repo root |

If you have any questions just message me. The goal is for the AI to handle all the Git plumbing so we can focus on actually building the app.
