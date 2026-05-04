import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

function SavedAnswer({ storageKey }) {
  const [answer, setAnswer] = useState('');
  const storageName = `ifu:${storageKey}`;

  useEffect(() => {
    setAnswer(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  function handleChange(event) {
    setAnswer(event.target.value);
    window.localStorage.setItem(storageName, event.target.value);
  }

  return (
    <textarea
      value={answer}
      onChange={handleChange}
      rows={3}
      className="mt-4 min-h-24 w-full resize-y rounded-[1.2rem] border border-outline-variant bg-white/70 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
      placeholder="Write your response here..."
    />
  );
}

function ArticleSection({ title, children }) {
  return (
    <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <h2 className="font-headline text-[1.75rem] leading-tight text-primary">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[1.02rem] leading-8 text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="rounded-[1.2rem] bg-surface-container-low p-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

const reflectionPrompts = [
  'What is a quiet time, and what elements should be included?',
  'Of the three reasons listed for a quiet time, which is the most compelling to you?',
  'Of the practical suggestions listed, which ones give you the most difficulty? Which do you find helpful?',
  'Which of the problems have you experienced? Are the suggestions helpful?',
  'What questions do you have about the reading?',
  'Does this reading convict, challenge or comfort you?',
];

const quietTimeElements = [
  'Reading the Bible with the intent not just to study but to meet Christ through the written Word.',
  'Meditating on what we have read so that biblical truth begins to saturate our minds, emotions and wills. “Meditate on [the Book of the Law] day and night” (Joshua 1:8).',
  'Praying to (communing with) God: praising, thanking and adoring him as well as confessing our sins, asking him to supply our needs and interceding for others.',
];

const benefits = [
  'Information. We learn about Christ and his truths when we spend time with him and his Word. Before we can obey him we need to know what he commands. Before we can understand what life is all about we need to know what he has taught.',
  'Encouragement. At times we get discouraged. There is no better source for inspiration than the Lord Jesus Christ.',
  'Power. Even when we know what we should be and do we lack the strength to be that kind of person and do those kinds of works. Christ is the source of power, and meeting with him is essential to our receiving it.',
  'Pleasure. Being alone with the person we love is enjoyable, and as we spend time with Christ we experience a joy unavailable anywhere else.',
];

const problems = [
  'I know I ought to have a daily quiet time, but I don’t want to. Solution: Ask the Holy Spirit to plant within you the desire to have a daily quiet time. Nobody else can do this for you. You cannot generate the desire, and no other person can produce it for you.',
  'I don’t feel like having a daily quiet time today. Solution: Have your quiet time anyway and honestly admit to Christ that you don’t feel like meeting him but that you know he nevertheless is worth the investment of your time. Ask him to improve your feelings and try to figure out why you feel this way. Then work on the factors that produce such failings.',
  'My mind wanders. Solution: Ask the Holy Spirit to give you strength to set your mind on Christ and his Word. Use your self-discipline to direct your mind so that it wanders less and less. If you are in a quiet place, singing, praying and reading out loud will give a sense of dialogue. Your mind will wander less when you write things down, like making an outline for prayer or study notes while reading the Bible.',
  'I miss too many quiet times. Solution: Ask the Lord to strengthen your desire and to give you power to discipline your use of time. Share with another Christian friend your desire to have a daily quiet time and allow your friend to hold you accountable for it. Don’t let an overactive conscience or the accusations of the devil play on your guilt. Confess that you have failed to keep your appointment with Jesus, ask his forgiveness and renew your relationship.',
  'My daily quiet time is a drag. Solution: Pray that the joy of the Lord would be restored to your private meeting with Christ (Psalm 51:12). Put some variety into your approach. Sing a hymn for a change, or try a different form of Bible study.',
];

export function QuietTimeNewToYouScreen() {
  return (
    <>
      <PageHeader title="If Quiet Time is New to You" backTo="/journey/quiet-time" />

      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《靈修》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.2rem] leading-tight">
            If Quiet Time is New to You
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            Adapted from: “Lord of the Universe, Lord of My Life”, & “Disciple Essentials”.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="psychology_alt" className="text-[22px]" />
            <h2 className="font-headline text-[1.55rem] text-primary">
              Read the article below. Ponder:
            </h2>
          </div>
          <div className="mt-5 grid gap-4">
            {reflectionPrompts.map((prompt, index) => (
              <article key={prompt} className="rounded-[1.45rem] bg-white p-5">
                <p className="font-headline text-[1.1rem] leading-8 text-primary">
                  {index + 1}. {prompt}
                </p>
                <SavedAnswer storageKey={`quiet-time-new-reflection-${index + 1}`} />
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <ArticleSection title="1. What Is Quiet Time">
            <p>A daily quiet time is a private meeting each day between a disciple and the Lord Jesus Christ. It should not be impromptu. We can commune with the Lord on a spur-of-the-moment basis many times each day, but a quiet time is a period of time we set aside in advance for the sole purpose of a personal meeting with our Savior and Lord.</p>
            <p>A daily quiet time consists of at least three components.</p>
            <BulletList items={quietTimeElements} />
          </ArticleSection>

          <ArticleSection title="2. Why Is It Important">
            <p>Why should we have a daily quiet time? There are at least three reasons.</p>
            <p>It pleases the Lord. Even if there were no other consequences, this would be sufficient reason for private daily communion with God.</p>
            <p>Of all the Old Testament sacrifices there was only one that was daily—the continual burnt offering. What was its purpose? Not to atone for sin but to provide pleasure (a sweet-smelling aroma) to the Lord. The New Testament directs us to continually offer up a sacrifice of praise to God, “the fruit of lips that confess his name” (Hebrews 13:15). It may astonish us to realize that God is seeking people who will do just that: “They are the kind of worshipers the Father seeks” (John 4:23). One indicator of the depth of our relationship with the Lord is our willingness to spend time alone with him not primarily for what we get out of it but for what it means to him as well.</p>
            <p>We receive benefits. The psalmist had this in mind when he wrote, “As the deer pants for streams of water, so my soul pants for you, O God. My soul thirsts for God, for the living God” (Psalm 42:1–2). We benefit from a quiet time in several ways.</p>
            <BulletList items={benefits} />
            <p>Jesus had a quiet time. “Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed” (Mark 1:35). If our Lord found it necessary to meet privately with his Father, surely his example gives us a good reason to do likewise.</p>
            <p>The question is whether we will be mediocre Christians or growing Christians. A major factor in determining the answer is whether or not we develop the discipline of a daily quiet time.</p>
          </ArticleSection>

          <ArticleSection title="3. How to Begin">
            <p>Once you desire to begin a daily quiet time, what can you do to start?</p>
            <p>First, remember the principle of self-discipline: do what you should do when you should, the way you should, where you should and for the correct reasons. In other words, self-discipline is the wise use of your personal resources (such as time and energy).</p>
            <p>Second, set aside time in advance for your quiet time. A daily quiet time should take place each day at the time when you are most alert. For some this will be in the morning, perhaps before breakfast; for others it will be another time of the day or evening. Though it is not a hard and fast rule, the morning is a preferable time since it begins before the rush of thoughts and activities of the day. An orchestra does not tune its instruments after the concert.</p>
            <p>How much time should you spend? This will vary from person to person, but a good plan to follow is to start with ten minutes a day and build up to approximately thirty minutes. This regularly scheduled chunk of time can be a major factor in strengthening self-discipline. Here’s a suggestion: pause while reading this and make a decision—now—about when and for how long, beginning tomorrow, you will meet the Lord Jesus Christ for a daily quiet time.</p>
            <p>Third, plan ahead. Go to bed early enough so that you can awaken in a refreshed condition to meet Christ. The battle for the daily quiet time is often lost the night before. Staying up too late hampers our alertness, making us bleary-eyed and numb as we meet the Lord, or else we oversleep and skip the quiet time altogether.</p>
            <p>Fourth, make your quiet time truly a quiet time. Psalm 46:10 speaks to this: “Be still, and know that I am God.” Turn off your radio or television. Find as quiet a place as possible and make sure your location and position are conducive to alertness. Get out of bed. Sit erect. If you are stretched out in bed or reclining in a chair that is too comfortable you might be lulled into drowsiness.</p>
            <p>Fifth, pray as you start your time with God. Ask the Holy Spirit to control your investment of time and to guide your praising, confessing, thanking, adoring, interceding, petitioning and meditating, as well as to help you get into the Bible. Open your mind and heart to Scripture.</p>
            <p>Sixth, keep a notebook handy. Write down ideas you want to remember and questions you can’t answer. Expression deepens impression—and writing is a good mode of expression.</p>
            <p>Last, share your plans and goals with a friend. Tell him or her you are trying to develop the discipline of a daily quiet time. Request his or her prayer that God will enable you to succeed with your objectives.</p>
          </ArticleSection>

          <ArticleSection title="4. When Problems Arise">
            <p>Following are some common problems that are often encountered along the way.</p>
            <BulletList items={problems} />
            <p>There are two major reasons it is so difficult to develop the discipline of a daily quiet time. First is the influence of the flesh. Keep in mind that your old nature is opposed to daily quiet time (and to every other discipline that would please Christ; see Galatians 5:16–17). Pray that the Holy Spirit will enable your new nature to overcome your old nature in this battle.</p>
            <p>The second reason is resistance by Satan. The devil opposes your every effort to please Christ. His strategy is to rob you of daily quiet time joy, to complicate your time schedule by keeping you up late at night and making it hard for you to get up in the morning, to make you drowsy during your time with the Lord, to make your mind wander, and otherwise to disrupt your meeting with Christ. Ask the Holy Spirit to restrain the devil.</p>
          </ArticleSection>

          <ArticleSection title="5. Do It Now">
            <p>Plan now for your daily quiet time tomorrow—and every tomorrow. If you miss a morning, do not quit. Deny the devil the pleasure of defeating you. Ask the Lord to forgive you for missing the meeting and to help you make it next time. You will doubtless miss several times, and it will take repeated beginnings before you succeed in developing this discipline. Indeed, it takes some people months to mature to the point where they develop the habit of a daily quiet time. For some it is a lifelong battle. In any case, don’t quit when you miss. With God’s help determine that you will grow to be a committed disciple who meets Christ regularly in meaningful daily quiet times.</p>
          </ArticleSection>
        </div>

        <section className="mt-8">
          <JourneyPager previous={{ to: '/journey/quiet-time', label: '靈修' }} />
        </section>
      </main>
    </>
  );
}
