from moviepy.editor import TextClip, CompositeVideoClip
from gtts import gTTS
import random
import os

# List of Forex tips
forex_tips = [
    "Never risk more than 2% of your capital on a single trade.",
    "Always follow the trend, the trend is your friend.",
    "Use stop-loss to protect your capital from big losses.",
    "Emotions will kill your trades. Trade with a plan, not with feelings.",
    "News events can cause volatility. Be careful before big announcements."
]

# Select a random tip
tip = random.choice(forex_tips)

# Convert text to speech
tts = gTTS(text=tip, lang="en")
audio_file = "forex_tip.mp3"
tts.save(audio_file)

# Create text clip for the video
text_clip = TextClip(tip, fontsize=50, color='white', size=(720, 1280), method='caption')
text_clip = text_clip.set_duration(10)  # 10-second video

# Create final video
final_clip = CompositeVideoClip([text_clip])
video_file = "forex_tip.mp4"
final_clip.write_videofile(video_file, fps=24)

print(f"Video created: {video_file}")

# Cleanup
os.remove(audio_file)
