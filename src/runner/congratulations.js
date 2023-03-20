const congrats = [
    "👏 Great work!",
    "👍 Awesome job!",
    "🎉 Congratulations!",
    "💪 Excellent work!",
    "👌 Fantastic job!",
    "🤩 Incredible work!",
    "🙌 Outstanding!",
    "👊 Superb job!",
    "👀 Terrific work!",
    "👨‍💻 Well done!"
]

const messages = [
    "🎉 All tests are passing with flying colors!",
    "🚀 You aced the test suite!",
    "💯 Your hard work has paid off - all tests are passing!",
    "👍 You've successfully passed all the tests!",
    "✅ All tests are passing without a hitch!",
    "👏 You've completed the tests and passed with flying colors!",
    "✔️ Your work has met all requirements and passed all tests!",
    "💪 You've demonstrated great skill by passing all the tests!",
    "🌟 All tests are passing perfectly!",
    "👨‍🔬 Your work has been thoroughly tested and all tests are passing!"
]

function congratulations() {
    const randomCongratulation = congrats[Math.floor(Math.random() * congrats.length)]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    return `${randomCongratulation} ${randomMessage}`
}
module.exports = { congratulations }