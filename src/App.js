import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- TRANSLATIONS ---

// Define base structure for questions and their scores (language-independent parts)
const baseQuestionsStructure = [
    { id: 1, textKey: "q1_text", options: [ { id: '1a', textKey: "q1_1a" }, { id: '1b', textKey: "q1_1b" }, { id: '1c', textKey: "q1_1c" }, { id: '1d', textKey: "q1_1d" } ] },
    { id: 2, textKey: "q2_text", options: [ { id: '2a', textKey: "q2_2a" }, { id: '2b', textKey: "q2_2b" }, { id: '2c', textKey: "q2_2c" }, { id: '2d', textKey: "q2_2d" } ] },
    { id: 3, textKey: "q3_text", options: [ { id: '3a', textKey: "q3_3a" }, { id: '3b', textKey: "q3_3b" }, { id: '3c', textKey: "q3_3c" }, { id: '3d', textKey: "q3_3d" } ] },
    { id: 4, textKey: "q4_text", options: [ { id: '4a', textKey: "q4_4a" }, { id: '4b', textKey: "q4_4b" }, { id: '4c', textKey: "q4_4c" }, { id: '4d', textKey: "q4_4d" } ] },
    { id: 5, textKey: "q5_text", options: [ { id: '5a', textKey: "q5_5a" }, { id: '5b', textKey: "q5_5b" }, { id: '5c', textKey: "q5_5c" }, { id: '5d', textKey: "q5_5d" } ] },
    { id: 6, textKey: "q6_text", options: [ { id: '6a', textKey: "q6_6a" }, { id: '6b', textKey: "q6_6b" }, { id: '6c', textKey: "q6_6c" }, { id: '6d', textKey: "q6_6d" } ] },
    { id: 7, textKey: "q7_text", options: [ { id: '7a', textKey: "q7_7a" }, { id: '7b', textKey: "q7_7b" }, { id: '7c', textKey: "q7_7c" }, { id: '7d', textKey: "q7_7d" } ] },
    { id: 8, textKey: "q8_text", options: [ { id: '8a', textKey: "q8_8a" }, { id: '8b', textKey: "q8_8b" }, { id: '8c', textKey: "q8_8c" }, { id: '8d', textKey: "q8_8d" } ] },
    { id: 9, textKey: "q9_text", options: [ { id: '9a', textKey: "q9_9a" }, { id: '9b', textKey: "q9_9b" }, { id: '9c', textKey: "q9_9c" }, { id: '9d', textKey: "q9_9d" } ] },
    { id: 10, textKey: "q10_text", options: [ { id: '10a', textKey: "q10_10a" }, { id: '10b', textKey: "q10_10b" }, { id: '10c', textKey: "q10_10c" }, { id: '10d', textKey: "q10_10d" } ] },
    { id: 11, textKey: "q11_text", options: [ { id: '11a', textKey: "q11_11a" }, { id: '11b', textKey: "q11_11b" }, { id: '11c', textKey: "q11_11c" }, { id: '11d', textKey: "q11_11d" } ] },
    { id: 12, textKey: "q12_text", options: [ { id: '12a', textKey: "q12_12a" }, { id: '12b', textKey: "q12_12b" }, { id: '12c', textKey: "q12_12c" }, { id: '12d', textKey: "q12_12d" } ] },
    { id: 13, textKey: "q13_text", options: [ { id: '13a', textKey: "q13_13a" }, { id: '13b', textKey: "q13_13b" }, { id: '13c', textKey: "q13_13c" }, { id: '13d', textKey: "q13_13d" } ] },
    { id: 14, textKey: "q14_text", options: [ { id: '14a', textKey: "q14_14a" }, { id: '14b', textKey: "q14_14b" }, { id: '14c', textKey: "q14_14c" }, { id: '14d', textKey: "q14_14d" } ] },
    { id: 15, textKey: "q15_text", options: [ { id: '15a', textKey: "q15_15a" }, { id: '15b', textKey: "q15_15b" }, { id: '15c', textKey: "q15_15c" }, { id: '15d', textKey: "q15_15d" } ] },
    { id: 16, textKey: "q16_text", options: [ { id: '16a', textKey: "q16_16a" }, { id: '16b', textKey: "q16_16b" }, { id: '16c', textKey: "q16_16c" }, { id: '16d', textKey: "q16_16d" } ] },
    { id: 17, textKey: "q17_text", options: [ { id: '17a', textKey: "q17_17a" }, { id: '17b', textKey: "q17_17b" }, { id: '17c', textKey: "q17_17c" }, { id: '17d', textKey: "q17_17d" } ] },
    { id: 18, textKey: "q18_text", options: [ { id: '18a', textKey: "q18_18a" }, { id: '18b', textKey: "q18_18b" }, { id: '18c', textKey: "q18_18c" }, { id: '18d', textKey: "q18_18d" } ] },
    { id: 19, textKey: "q19_text", options: [ { id: '19a', textKey: "q19_19a" }, { id: '19b', textKey: "q19_19b" }, { id: '19c', textKey: "q19_19c" }, { id: '19d', textKey: "q19_19d" } ] },
    { id: 20, textKey: "q20_text", options: [ { id: '20a', textKey: "q20_20a" }, { id: '20b', textKey: "q20_20b" }, { id: '20c', textKey: "q20_20c" }, { id: '20d', textKey: "q20_20d" } ] },
    { id: 21, textKey: "q21_text", options: [ { id: '21a', textKey: "q21_21a" }, { id: '21b', textKey: "q21_21b" }, { id: '21c', textKey: "q21_21c" }, { id: '21d', textKey: "q21_21d" } ] },
    { id: 22, textKey: "q22_text", options: [ { id: '22a', textKey: "q22_22a" }, { id: '22b', textKey: "q22_22b" }, { id: '22c', textKey: "q22_22c" }, { id: '22d', textKey: "q22_22d" } ] },
    { id: 23, textKey: "q23_text", options: [ { id: '23a', textKey: "q23_23a" }, { id: '23b', textKey: "q23_23b" }, { id: '23c', textKey: "q23_23c" }, { id: '23d', textKey: "q23_23d" } ] },
    { id: 24, textKey: "q24_text", options: [ { id: '24a', textKey: "q24_24a" }, { id: '24b', textKey: "q24_24b" }, { id: '24c', textKey: "q24_24c" }, { id: '24d', textKey: "q24_24d" } ] },
    { id: 25, textKey: "q25_text", options: [ { id: '25a', textKey: "q25_25a" }, { id: '25b', textKey: "q25_25b" }, { id: '25c', textKey: "q25_25c" }, { id: '25d', textKey: "q25_25d" } ] },
];
const scoresMap = {
    '1a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '1b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '1c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '1d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '2a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '2b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '2c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '2d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '3a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '3b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '3c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '3d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '4a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '4b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '4c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '4d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '5a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '5b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '5c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '5d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '6a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '6b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '6c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '6d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '7a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '7b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '7c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '7d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '8a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '8b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '8c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '8d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '9a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '9b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '9c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '9d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '10a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '10b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '10c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '10d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '11a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '11b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '11c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '11d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '12a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '12b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '12c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '12d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '13a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '13b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '13c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '13d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '14a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '14b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '14c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '14d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '15a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '15b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '15c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '15d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '16a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '16b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '16c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '16d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '17a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '17b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '17c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '17d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '18a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '18b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '18c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '18d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '19a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '19b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '19c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '19d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '20a': { Dynamikrot: 6, Freigeistgelb: 1, Balancegrün: 0, Logikblau: 2 }, '20b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '20c': { Dynamikrot: 0, Freigeistgelb: 2, Balancegrün: 6, Logikblau: 1 }, '20d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '21a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '21b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '21c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '21d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '22a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '22b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '22c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '22d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '23a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '23b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '23c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '23d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '24a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '24b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '24c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '24d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
    '25a': { Dynamikrot: 6, Freigeistgelb: 2, Balancegrün: 0, Logikblau: 1 }, '25b': { Dynamikrot: 1, Freigeistgelb: 6, Balancegrün: 2, Logikblau: 0 }, '25c': { Dynamikrot: 0, Freigeistgelb: 1, Balancegrün: 6, Logikblau: 2 }, '25d': { Dynamikrot: 2, Freigeistgelb: 0, Balancegrün: 1, Logikblau: 6 },
};

// Moved function declaration to the top to ensure it's defined before use.
function createTranslatedQuestions(langQuestionTexts) {
    return baseQuestionsStructure.map(q => ({
        id: q.id,
        text: langQuestionTexts[q.textKey], 
        options: q.options.map(opt => ({
            id: opt.id,
            text: langQuestionTexts[opt.textKey], 
            scores: scoresMap[opt.id]
        }))
    }));
};

const deQuestionTexts = {
    q1_text: "Im beruflichen Alltag fühlst du dich am produktivsten, wenn du...",
    q1_1a: "deine Energie in neue, ergebnisorientierte Projekte stecken kannst.", 
    q1_1b: "innovative Konzepte entwickeln und im Team präsentieren kannst.", 
    q1_1c: "ein harmonisches und stabiles Arbeitsumfeld für alle sicherstellen kannst.", 
    q1_1d: "komplexe Sachverhalte detailliert analysieren und präzise planen kannst.",
    q2_text: "Bei Meinungsverschiedenheiten im Team neigst du dazu,...",
    q2_2a: "deinen Standpunkt klar zu vertreten und eine schnelle Entscheidung anzustreben.", 
    q2_2b: "mit kreativen Ansätzen oder Humor die Situation aufzulockern und neue Perspektiven zu eröffnen.", 
    q2_2c: "einen Konsens zu suchen und auf ein gutes Miteinander zu achten.", 
    q2_2d: "dich zunächst zurückzuziehen, um die verschiedenen Argumente objektiv zu bewerten.",
    q3_text: "Kollegen würden deine Arbeitsweise am ehesten als _______ beschreiben.",
    q3_3a: "zielorientiert und durchsetzungsstark.", 
    q3_3b: "inspirierend und ideenreich.", 
    q3_3c: "kooperativ und zuverlässig.", 
    q3_3d: "analytisch und gewissenhaft.",
    q4_text: "Wenn du ein neues berufliches Projekt startest, fokussierst du dich zuerst auf...",
    q4_4a: "die schnelle Umsetzung erster Schritte und das Erreichen sichtbarer Meilensteine.", 
    q4_4b: "das Brainstorming vielfältiger Ideen und unkonventioneller Lösungsansätze.", 
    q4_4c: "den Aufbau eines tragfähigen Plans und die Sicherstellung der notwendigen Ressourcen und Teamabstimmung.", 
    q4_4d: "die detaillierte Analyse potenzieller Risiken und die Erstellung exakter Spezifikationen.",
    q5_text: "Deine größte Stärke im Berufsleben ist deine Fähigkeit,...",
    q5_5a: "auch unter Druck schnelle und klare Entscheidungen zu treffen.", 
    q5_5b: "andere für eine Vision zu begeistern und ein positives Arbeitsklima zu fördern.", 
    q5_5c: "ein unterstützendes und stabiles Umfeld zu schaffen, in dem sich jeder einbringen kann.", 
    q5_5d: "komplexe Probleme systematisch zu lösen und für hohe Qualitätsstandards zu sorgen.",
    q6_text: "Im Berufsalltag fühlst du dich am meisten gestresst, wenn...",
    q6_6a: "du das Gefühl hast, die Kontrolle über wichtige Prozesse zu verlieren oder übergangen zu werden.", 
    q6_6b: "deine Aufgaben monoton werden und es an kreativem Freiraum oder neuen Impulsen mangelt.", 
    q6_6c: "Konflikte im Team die Zusammenarbeit belasten oder es zu Unstimmigkeiten kommt.", 
    q6_6d: "du mit unklaren Anweisungen, unlogischen Prozessen oder mangelnder Präzision konfrontiert wirst.",
    q7_text: "Dein idealer Beitrag in einem Teamprojekt ist...",
    q7_7a: "die Führung zu übernehmen, klare Ziele zu setzen und das Team zum Erfolg zu treiben.", 
    q7_7b: "neue Ideen einzubringen, für Motivation zu sorgen und die Kommunikation zu fördern.", 
    q7_7c: "für ein gutes Teamklima zu sorgen, unterstützend zu wirken und Vereinbarungen zuverlässig umzusetzen.", 
    q7_7d: "Informationen sorgfältig zu prüfen, Prozesse zu optimieren und die Qualität sicherzustellen.",
    q8_text: "Du bist beruflich am zufriedensten, wenn du...",
    q8_8a: "anspruchsvolle Ziele erreichst und für deine Leistungen Anerkennung erhältst.", 
    q8_8b: "ständig Neues lernst, innovative Lösungen entwickeln und deine Ideen umsetzen kannst.", 
    q8_8c: "einen wertvollen Beitrag zum Teamerfolg leistest und harmonische Arbeitsbeziehungen pflegst.", 
    q8_8d: "komplexe Aufgaben erfolgreich abschließen und siehst, dass deine Arbeit höchsten Standards genügt.",
    q9_text: "Wenn du eine wichtige berufliche Entscheidung triffst, verlässt du dich am meisten auf...",
    q9_9a: "deinen Instinkt und deine Entschlossenheit, auch wenn es Risiken birgt.", 
    q9_9b: "deine Kreativität und Intuition, um innovative Wege zu finden.", 
    q9_9c: "die Meinungen und Erfahrungen von Kollegen sowie den Konsens im Team.", 
    q9_9d: "eine sorgfältige Analyse von Fakten, Daten und logischen Schlussfolgerungen.",
    q10_text: "Eine mögliche Herausforderung in deiner Arbeitsweise ist manchmal...",
    q10_10a: "deine Ungeduld oder dein dominantes Auftreten, wenn Dinge nicht schnell genug gehen.", 
    q10_10b: "eine Tendenz zur Unorganisiertheit oder das Übersehen von Details bei Routineaufgaben.", 
    q10_10c: "deine Zögerlichkeit, klare Entscheidungen zu treffen, besonders wenn Konflikte drohen.", 
    q10_10d: "dein Perfektionismus oder eine übermäßig kritische Haltung gegenüber Fehlern.",
    q11_text: "Du bevorzugst Arbeitsumgebungen, die...",
    q11_11a: "dynamisch sind, schnelle Ergebnisse erfordern und dir Entscheidungsfreiheit lassen.", 
    q11_11b: "kreativ, inspirierend und auf offene Kommunikation und Zusammenarbeit ausgerichtet sind.", 
    q11_11c: "stabil, sicher und unterstützend sind, mit klaren Strukturen und gutem Teamgeist.", 
    q11_11d: "strukturiert und gut organisiert sind und präzise, qualitativ hochwertige Arbeit ermöglichen.",
    q12_text: "Wenn du ein berufliches Ziel verfolgst, bist du...",
    q12_12a: "hartnäckig und entschlossen, auch bei Widerständen nicht aufzugeben.", 
    q12_12b: "flexibel und bereit, deine Strategie anzupassen, wenn sich Umstände ändern.", 
    q12_12c: "geduldig und ausdauernd, und wartest auf den richtigen Moment für deine Schritte.", 
    q12_12d: "methodisch und planen jeden Schritt sorgfältig, um Fehler zu minimieren.",
    q13_text: "Auf unvorhergesehene Veränderungen im Projektverlauf reagierst du, indem du...",
    q13_13a: "sie als Chance für neue, mutige Lösungsansätze sehen und schnell handelst.", 
    q13_13b: "dich rasch anpasst, neue Möglichkeiten erkunden und das Team motivieren.", 
    q13_13c: "zunächst Zeit benötigst, um dich anzupassen und Stabilität wiederherzustellen, bevor du handelst.", 
    q13_13d: "die Auswirkungen detailliert analysierst und einen überarbeiteten, logischen Plan entwickelst.",
    q14_text: "Deine größte berufliche Motivation ist...",
    q14_14a: "Erfolg, das Erreichen von Zielen und die damit verbundene Anerkennung.", 
    q14_14b: "die Möglichkeit, kreativ zu sein, neue Erfahrungen zu sammeln und andere zu inspirieren.", 
    q14_14c: "ein sicheres Arbeitsumfeld, gute Beziehungen zu Kollegen und Wertschätzung für deine Loyalität.", 
    q14_14d: "das Erlangen von Fachwissen, das Verstehen komplexer Zusammenhänge und das Liefern präziser Arbeit.",
    q15_text: "Im Team fühlst du dich am wohlsten, wenn du...",
    q15_15a: "die Leitung innehaben oder maßgeblich die Richtung vorgeben kannst.", 
    q15_15b: "deine Ideen frei äußern und in einer dynamischen, offenen Atmosphäre arbeiten kannst.", 
    q15_15c: "als verlässliches Mitglied einen Beitrag zum gemeinsamen Erfolg leisten und Harmonie herrscht.", 
    q15_15d: "deine analytischen Fähigkeiten einbringen und zur Qualitätssicherung beitragen kannst.",
    q16_text: "Du bist am effektivsten in deiner Arbeit, wenn du...",
    q16_16a: "klare Ziele und die Freiheit hast, den Weg dorthin selbst zu bestimmen und schnell zu handeln.", 
    q16_16b: "Raum für Experimente haben und unkonventionelle Ideen in einem flexiblen Umfeld verfolgen kannst.", 
    q16_16c: "in einem unterstützenden Team arbeitest, in dem offene Kommunikation und gegenseitiger Respekt gepflegt werden.", 
    q16_16d: "genügend Zeit und Informationen hast, um alle Details sorgfältig zu prüfen und deine Aufgaben präzise zu planen.",
    q17_text: "Deine bevorzugte Art, dich neues berufliches Wissen anzueignen, ist...",
    q17_17a: "durch Ausprobieren, Learning-by-Doing und praktische Anwendung.", 
    q17_17b: "durch Diskussionen mit Kollegen, Teilnahme an Workshops und den Austausch von Ideen.", 
    q17_17c: "durch sorgfältige Beobachtung, das Anhören von Experten und schrittweise Einarbeitung.", 
    q17_17d: "durch das Lesen von Fachliteratur, detaillierte Recherche und systematische Analyse von Informationen.",
    q18_text: "Wenn im Projekt ein Problem auftritt, suchst du nach...",
    q18_18a: "einer direkten, pragmatischen und schnellen Lösung, um voranzukommen.", 
    q18_18b: "kreativen, unkonventionellen Ansätzen und neuen Perspektiven zur Problemlösung.", 
    q18_18c: "Unterstützung im Team und einem gemeinsamen Weg, der von allen getragen wird.", 
    q18_18d: "einer gründlichen Ursachenanalyse und einem systematischen, datengestützten Vorgehen.",
    q19_text: "Du bist am besten in der Lage, Kollegen zu überzeugen, indem du...",
    q19_19a: "deine Argumente klar, direkt und mit Nachdruck kommunizierst.", 
    q19_19b: "Begeisterung für deine Ideen weckst und eine positive, motivierende Atmosphäre schaffst.", 
    q19_19c: "Vertrauen aufbaust, aktiv zuhörst und die Bedürfnisse anderer berücksichtigst.", 
    q19_19d: "logische Argumente, Fakten und detaillierte Daten präsentierst.",
    q20_text: "Deine größte Sorge im beruflichen Kontext ist...",
    q20_20a: "Kontrollverlust über wichtige Projekte oder das Nichterreichen von Zielen.", 
    q20_20b: "monotone Routineaufgaben oder ein Mangel an kreativen Herausforderungen.", 
    q20_20c: "Konflikte im Team oder die Ablehnung deiner Person oder deiner Beiträge.", 
    q20_20d: "Fehler zu machen, unvollständige Arbeit abzuliefern oder kritisiert zu werden.",
    q21_text: "In deiner beruflichen Rolle verbringst du deine Zeit am liebsten mit...",
    q21_21a: "aktiven, herausfordernden Aufgaben, die schnelle Entscheidungen erfordern.", 
    q21_21b: "kreativen Projekten, Brainstorming-Sitzungen oder dem Netzwerken mit Kollegen.", 
    q21_21c: "Aufgaben, die Stabilität erfordern, und der Pflege guter Arbeitsbeziehungen.", 
    q21_21d: "der Analyse komplexer Daten, der Optimierung von Prozessen oder der Recherche.",
    q22_text: "Deine typische Reaktion auf konstruktive Kritik von Vorgesetzten oder Kollegen ist...",
    q22_22a: "sie als Herausforderung zu sehen, um deine Leistung direkt zu verbessern und Ergebnisse zu optimieren.", 
    q22_22b: "sie als Ansporn zu nehmen, kreativer zu denken und neue Lösungsansätze zu finden.", 
    q22_22c: "sie zunächst persönlich zu nehmen, aber dann nach Wegen zu suchen, die Harmonie wiederherzustellen und Erwartungen zu erfüllen.", 
    q22_22d: "sie sorgfältig und objektiv zu analysieren und gegebenenfalls präzise Korrekturen vorzunehmen.",
    q23_text: "Du bist am besten in der Lage, ein Team zu führen, indem du...",
    q23_23a: "klare Anweisungen gibst, Entscheidungen treffen und Ergebnisse konsequent einfordern.", 
    q23_23b: "eine inspirierende Vision teilen, Begeisterung wecken und Freiräume für Kreativität schaffen.", 
    q23_23c: "ein unterstützendes und vertrauensvolles Umfeld schaffen, in dem jeder Einzelne wertgeschätzt wird.", 
    q23_23d: "logische Pläne erstellen, klare Prozesse definieren und eine strukturierte Vorgehensweise sicherstellen.",
    q24_text: "Deine Einstellung zu bestehenden Regeln und Unternehmensrichtlinien ist...",
    q24_24a: "dass sie manchmal hinderlich sein können, wenn sie schnelle Entscheidungen oder Fortschritt blockieren.", 
    q24_24b: "dass sie flexibel gehandhabt werden sollten, um Innovation und neue Ideen nicht zu behindern.", 
    q24_24c: "dass sie wichtig sind, um ein faires und stabiles Arbeitsumfeld für alle zu gewährleisten.", 
    q24_24d: "dass sie notwendig sind, um Effizienz, Qualität und Präzision in den Arbeitsabläufen zu sichern.",
    q25_text: "Beruflich bist du am zufriedensten, wenn du...",
    q25_25a: "ein anspruchsvolles Ziel erreicht und deine Wettbewerbsfähigkeit unter Beweis gestellt hast.", 
    q25_25b: "etwas Neues und Aufregendes initiiert und andere mit deiner Begeisterung angesteckt hast.", 
    q25_25c: "anderen Kollegen geholfen, positive Beziehungen im Team gepflegt und zur Harmonie beigetragen haben.", 
    q25_25d: "ein komplexes Problem gründlich analysiert, verstanden und eine qualitativ hochwertige Lösung implementiert hast.",
};
const enQuestionTexts = { 
    q1_text: "In your professional life, you feel most productive when you can...",
    q1_1a: "channel your energy into new, results-oriented projects.", 
    q1_1b: "develop innovative concepts and present them to the team.", 
    q1_1c: "ensure a harmonious and stable working environment for everyone.", 
    q1_1d: "analyze complex issues in detail and plan precisely.",
    q2_text: "In case of disagreements within the team, you tend to...",
    q2_2a: "clearly state your position and aim for a quick decision.", 
    q2_2b: "use creative approaches or humor to lighten the situation and open up new perspectives.", 
    q2_2c: "seek consensus and pay attention to good cooperation.", 
    q2_2d: "initially withdraw to objectively evaluate the different arguments.",
    q3_text: "Colleagues would most likely describe your working style as _______.",
    q3_3a: "goal-oriented and assertive.", 
    q3_3b: "inspiring and imaginative.", 
    q3_3c: "cooperative and reliable.", 
    q3_3d: "analytical and conscientious.",
    q4_text: "When starting a new professional project, you first focus on...",
    q4_4a: "the quick implementation of initial steps and achieving visible milestones.", 
    q4_4b: "brainstorming diverse ideas and unconventional solutions.", 
    q4_4c: "building a viable plan and ensuring the necessary resources and team coordination.", 
    q4_4d: "the detailed analysis of potential risks and the creation of exact specifications.",
    q5_text: "Your greatest strength in professional life is your ability to...",
    q5_5a: "make quick and clear decisions, even under pressure.", 
    q5_5b: "inspire others for a vision and promote a positive work atmosphere.", 
    q5_5c: "create a supportive and stable environment where everyone can contribute.", 
    q5_5d: "systematically solve complex problems and ensure high quality standards.",
    q6_text: "In your daily work life, you feel most stressed when...",
    q6_6a: "you feel you are losing control over important processes or are being bypassed.", 
    q6_6b: "your tasks become monotonous and there is a lack of creative freedom or new impulses.", 
    q6_6c: "conflicts in the team strain cooperation or disagreements arise.", 
    q6_6d: "you are confronted with unclear instructions, illogical processes, or a lack of precision.",
    q7_text: "Your ideal contribution to a team project is...",
    q7_7a: "taking the lead, setting clear goals, and driving the team to success.", 
    q7_7b: "bringing in new ideas, providing motivation, and fostering communication.", 
    q7_7c: "ensuring a good team atmosphere, acting supportively, and reliably implementing agreements.", 
    q7_7d: "carefully checking information, optimizing processes, and ensuring quality.",
    q8_text: "You are most satisfied professionally when you...",
    q8_8a: "achieve challenging goals and receive recognition for your achievements.", 
    q8_8b: "are constantly learning new things, developing innovative solutions, and can implement your ideas.", 
    q8_8c: "make a valuable contribution to team success and cultivate harmonious working relationships.", 
    q8_8d: "successfully complete complex tasks and see that your work meets the highest standards.",
    q9_text: "When making an important professional decision, you rely most on...",
    q9_9a: "your instinct and determination, even if it involves risks.", 
    q9_9b: "your creativity and intuition to find innovative paths.", 
    q9_9c: "the opinions and experiences of colleagues, as well as team consensus.", 
    q9_9d: "a careful analysis of facts, data, and logical conclusions.",
    q10_text: "A potential challenge in your work style is sometimes...",
    q10_10a: "your impatience or dominant demeanor when things don't move quickly enough.", 
    q10_10b: "a tendency towards disorganization or overlooking details in routine tasks.", 
    q10_10c: "your hesitation to make clear decisions, especially when conflicts loom.", 
    q10_10d: "your perfectionism or an overly critical attitude towards mistakes.",
    q11_text: "You prefer work environments that are...",
    q11_11a: "dynamic, require quick results, and give you decision-making freedom.", 
    q11_11b: "creative, inspiring, and focused on open communication and collaboration.", 
    q11_11c: "stable, secure, and supportive, with clear structures and good team spirit.", 
    q11_11d: "structured and well-organized, enabling precise, high-quality work.",
    q12_text: "When pursuing a professional goal, you are...",
    q12_12a: "persistent and determined, not giving up even in the face of resistance.", 
    q12_12b: "flexible and willing to adapt your strategy when circumstances change.", 
    q12_12c: "patient and persevering, waiting for the right moment for your steps.", 
    q12_12d: "methodical and plan each step carefully to minimize errors.",
    q13_text: "You react to unforeseen changes in the project course by...",
    q13_13a: "seeing them as an opportunity for new, bold solutions and acting quickly.", 
    q13_13b: "quickly adapting, exploring new possibilities, and motivating the team.", 
    q13_13c: "initially needing time to adjust and restore stability before acting.", 
    q13_13d: "analyzing the impact in detail and developing a revised, logical plan.",
    q14_text: "Your greatest professional motivation is...",
    q14_14a: "success, achieving goals, and the associated recognition.", 
    q14_14b: "the opportunity to be creative, gain new experiences, and inspire others.", 
    q14_14c: "a secure work environment, good relationships with colleagues, and appreciation for your loyalty.", 
    q14_14d: "gaining expertise, understanding complex contexts, and delivering precise work.",
    q15_text: "In a team, you feel most comfortable when you can...",
    q15_15a: "take the lead or significantly set the direction.", 
    q15_15b: "freely express your ideas and work in a dynamic, open atmosphere.", 
    q15_15c: "contribute as a reliable member to common success and harmony prevails.", 
    q15_15d: "apply your analytical skills and contribute to quality assurance.",
    q16_text: "You are most effective in your work when you...",
    q16_16a: "have clear goals and the freedom to determine your own path and act quickly.", 
    q16_16b: "have room for experimentation and can pursue unconventional ideas in a flexible environment.", 
    q16_16c: "work in a supportive team where open communication and mutual respect are cultivated.", 
    q16_16d: "have enough time and information to carefully check all details and plan your tasks precisely.",
    q17_text: "Your preferred way of acquiring new professional knowledge is...",
    q17_17a: "through trial and error, learning-by-doing, and practical application.", 
    q17_17b: "through discussions with colleagues, participating in workshops, and exchanging ideas.", 
    q17_17c: "through careful observation, listening to experts, and step-by-step familiarization.", 
    q17_17d: "by reading professional literature, detailed research, and systematic analysis of information.",
    q18_text: "When a problem arises in a project, you look for...",
    q18_18a: "a direct, pragmatic, and quick solution to move forward.", 
    q18_18b: "creative, unconventional approaches, and new perspectives for problem-solving.", 
    q18_18c: "support within the team and a common path that everyone agrees on.", 
    q18_18d: "a thorough root cause analysis and a systematic, data-driven approach.",
    q19_text: "You are best able to persuade colleagues by...",
    q19_19a: "communicating your arguments clearly, directly, and assertively.", 
    q19_19b: "arousing enthusiasm for your ideas and creating a positive, motivating atmosphere.", 
    q19_19c: "building trust, listening actively, and considering the needs of others.", 
    q19_19d: "presenting logical arguments, facts, and detailed data.",
    q20_text: "Your biggest concern in a professional context is...",
    q20_20a: "losing control over important projects or failing to achieve goals.", 
    q20_20b: "monotonous routine tasks or a lack of creative challenges.", 
    q20_20c: "conflicts within the team or rejection of your person or contributions.", 
    q20_20d: "making mistakes, delivering incomplete work, or being criticized.",
    q21_text: "In your professional role, you prefer to spend your time on...",
    q21_21a: "active, challenging tasks that require quick decisions.", 
    q21_21b: "creative projects, brainstorming sessions, or networking with colleagues.", 
    q21_21c: "tasks that require stability and nurturing good working relationships.", 
    q21_21d: "analyzing complex data, optimizing processes, or conducting research.",
    q22_text: "Your typical reaction to constructive criticism from supervisors or colleagues is...",
    q22_22a: "to see it as a challenge to directly improve your performance and optimize results.", 
    q22_22b: "to take it as an incentive to think more creatively and find new solutions.", 
    q22_22c: "to initially take it personally, but then look for ways to restore harmony and meet expectations.", 
    q22_22d: "to analyze it carefully and objectively and make precise corrections if necessary.",
    q23_text: "You are best able to lead a team by...",
    q23_23a: "giving clear instructions, making decisions, and consistently demanding results.", 
    q23_23b: "sharing an inspiring vision, arousing enthusiasm, and creating space for creativity.", 
    q23_23c: "creating a supportive and trusting environment where every individual is valued.", 
    q23_23d: "creating logical plans, defining clear processes, and ensuring a structured approach.",
    q24_text: "Your attitude towards existing rules and company policies is...",
    q24_24a: "that they can sometimes be obstacles if they block quick decisions or progress.", 
    q24_24b: "that they should be handled flexibly to avoid hindering innovation and new ideas.", 
    q24_24c: "that they are important to ensure a fair and stable working environment for everyone.", 
    q24_24d: "that they are necessary to ensure efficiency, quality, and precision in work processes.",
    q25_text: "Professionally, you are most satisfied when you...",
    q25_25a: "have achieved a challenging goal and demonstrated your competitiveness.", 
    q25_25b: "have initiated something new and exciting and infected others with your enthusiasm.", 
    q25_25c: "have helped other colleagues, nurtured positive team relationships, and contributed to harmony.", 
    q25_25d: "have thoroughly analyzed and understood a complex problem and implemented a high-quality solution.",
};

const translations = {
  de: {
    appName: "ColorCompass – Dein innerer Kompass",
    startQuiz: "Fragebogen starten",
    next: "Weiter",
    back: "Zurück",
    showResults: "Ergebnisse anzeigen",
    resetSelection: "Auswahl zurücksetzen",
    errorUniqueRating: (ratingLabel) => `Die Bewertung "${ratingLabel}" wurde bereits für eine andere Aussage in dieser Frage vergeben. Bitte wähle eine einzigartige Bewertung für jede Aussage.`,
    errorCompleteQuestion: "Bitte bewerte alle vier Aussagen mit unterschiedlichen Kategorien, bevor du fortfährst.",
    resultsTitle: "Deine Ergebnisse",
    typePrefix: "Typ:",
    balancedTypeLabel: "Ausgeglichen",
    typeNotDetermined: "Nicht ermittelt",
    typeError: "Fehler bei Ermittlung",
    pieChartTitle: "Punkteverteilung",
    percentageDistributionTitle: "Prozentuale Verteilung",
    noPieData: "Keine Daten für das Kreisdiagramm vorhanden.",
    individualAssessmentTitle: "Individuelle Einschätzung:",
    generalColorDescriptionsTitle: "Allgemeine Farbbeschreibungen:",
    importantNoticeTitle: "Wichtiger Hinweis:",
    importantNoticeText: "Diese Ergebnisse und Analysen dienen ausschließlich deiner Selbstreflexion und Unterhaltung. Sie stellen keine wissenschaftlich validierte psychologische Diagnose dar und sind nicht mit offiziellen Testverfahren oder anderen geschützten Systemen verbunden oder von diesen abgeleitet. Bitte interpretiere die Ergebnisse mit Bedacht.",
    basisDisclaimer: "Das Konzept und die Inhalte dieser Anwendung basieren auf öffentlich zugänglichen Informationen und allgemeinen Veröffentlichungen zum Thema Persönlichkeitstests und Farbpsychologie.",
    restart: "Neustart",
    privacyPolicyLink: "Datenschutz",
    privacyPolicyButtonClose: "Schließen",
    progressLabel: "Fortschritt",
    questionLabel: (current, total) => `Frage ${current}${total ? ` von ${total}` : ''}`,
    ratingTableHeader: "Aussage",
    ratingTableRatingColHeader: "Trifft zu", 
    noResultsYet: "Bitte fülle zuerst den Fragebogen aus, um deine Ergebnisse zu sehen.",
    shareableResultTitle: "Dein Farb-Profil zum Teilen:",
    copyTypeButtonLabel: "Typ-Visualisierung kopieren",
    copiedMessage: "Kopiert!",
    introductionPage: {
        appShortDescription: "Entdecke deine beruflichen Persönlichkeitspräferenzen! Dieser Fragebogen ermöglicht dir eine erste Einschätzung deines Persönlichkeitstyps im beruflichen Kontext anhand von vier verschiedenen Farbtypen und gibt dir Einblicke in typische Verhaltensweisen.",
        welcomeMessage: "Dieser Fragebogen hilft dir, deine Persönlichkeitspräferenzen basierend auf vier verschiedenen Farbtypen zu entdecken:", // This line is effectively overridden by appShortDescription for the main intro text.
        instructionsHeader: "Für jede der folgenden Fragen wirst du vier Aussagen sehen. Bitte bewerte jede Aussage, je nachdem, wie sehr sie auf dich zutrifft, indem du jeder Aussage eine der folgenden Kategorien zuweist:",
        ratingExplanation: {
            6: "Dies beschreibt dich sehr gut.",
            3: "Dies trifft auf dich zu.",
            2: "Dies trifft eher weniger auf dich zu.",
            0: "Dies beschreibt dich kaum oder gar nicht."
        },
        importantInstruction: "Wichtig: Innerhalb jeder Frage muss jede Bewertungskategorie (z.B. \"Trifft sehr zu\") genau einmal vergeben werden. Du kannst also nicht zwei Aussagen mit \"Trifft sehr zu\" bewerten.",
        noticeTitle: "Bitte beachte:",
        noticeText1: "Dieser Fragebogen ist ein Werkzeug zur Selbstreflexion und dient der Unterhaltung. Es handelt sich hierbei um ein rein privates Projekt.",
        noticeText2: "Die hier verwendeten Farbtypen und Beschreibungen sind vereinfachte Modelle und stehen in keiner direkten Verbindung zu geschützten Systemen oder anderen etablierten Persönlichkeitstests.",
        noticeText3: "Die Ergebnisse sollten als Anregung verstanden werden und nicht als endgültige Bewertung deiner Persönlichkeit."
    },
    assessmentTextParts: {
        noScores: "Es konnten keine Ergebnisse berechnet werden, da keine Punkte vergeben wurden. Bitte fülle den Fragebogen aus.",
        balancedProfileIntro: "Deine Antworten deuten auf ein <strong>ausgewogenes Persönlichkeitsprofil</strong> hin, bei dem keine einzelne Farbe stark dominiert. Dies spricht für eine bemerkenswerte Vielseitigkeit und Anpassungsfähigkeit. Du scheinst in der Lage zu sein, je nach Situation unterschiedliche Stärken und Herangehensweisen zu nutzen.<br /><br />",
        balancedDistribution: "Die prozentuale Verteilung deiner Farbanteile ist wie folgt: <br />",
        balancedStrongestEmphasis: (firstColorName, firstColorStrength1, firstColorStrength2, firstColorMotivation, secondColorName, secondColorPercentage) =>
            `Innerhalb dieser Ausgewogenheit ist die Präferenz für <strong>${firstColorName}</strong> dennoch am deutlichsten erkennbar. Dies legt nahe, dass du dazu neigst, Qualitäten wie ${firstColorStrength1} und ${firstColorStrength2} etwas häufiger zu zeigen. Deine Motivation könnte hierbei oft von Aspekten wie ${firstColorMotivation} geleitet sein. Die Eigenschaften der zweitstärksten Farbe, <strong>${secondColorName}</strong> (${secondColorPercentage}%), runden dein Profil ab und bieten zusätzliche Flexibilität.<br /><br />`,
        balancedGeneralEmphasis: (firstColorName, firstColorPercentage, secondColorName, secondColorPercentage) =>
            `Die Qualitäten von <strong>${firstColorName}</strong> (${firstColorPercentage}%) und <strong>${secondColorName}</strong> (${secondColorPercentage}%) sind in deinem Profil am präsentesten und wirken oft im Zusammenspiel. Dies deutet auf eine flexible Kombination ihrer jeweiligen Stärken hin.<br /><br />`,
        balancedAdvice: "Deine Ausgewogenheit ist eine Stärke, die dir erlaubt, flexibel zu agieren. Achte darauf, dass diese Flexibilität nicht zu Unentschlossenheit führt, wenn klare Positionierungen gefragt sind. Manchmal kann es hilfreich sein, bewusst eine deiner stärkeren Präferenzen zu betonen, um Ziele zu erreichen oder Entscheidungen zu treffen.<br /><br />",
        dominantProfileIntro: (firstColorName, firstPercentage, secondColorName, secondPercentage) =>
            `Deine Antworten deuten auf ein Persönlichkeitsprofil hin, bei dem <strong>${firstColorName}</strong> (${firstPercentage}%) am stärksten ausgeprägt ist, gefolgt von <strong>${secondColorName}</strong> (${secondPercentage}%).<br /><br />`,
        dominantPreference: (colorName, strengths, motivation, communication, challenges) =>
            `<strong>Dominante Präferenz: ${colorName}</strong><br />Personen mit einer hohen Präferenz für ${colorName} sind oft ${strengths}. Sie werden motiviert durch ${motivation} und kommunizieren typischerweise ${communication}. Mögliche Herausforderungen oder Entwicklungsfelder könnten ${challenges} sein.<br /><br />`,
        secondaryPreference: (colorName, strengths, motivation, communication, challenges) =>
            `<strong>Zweitstärkste Präferenz: ${colorName}</strong><br />Deine zweitstärkste Präferenz, ${colorName}, ergänzt dein Profil. Typische Stärken sind hier ${strengths}. Als Motivation dient oft ${motivation}. Die Kommunikation ist meist ${communication}. Achte auf mögliche Fallstricke wie ${challenges}.<br /><br />`,
        comboRedYellow: "<strong>Kombination im Fokus (Rot-Gelb):</strong> Diese Mischung deutet auf eine sehr dynamische, ergebnisorientierte und gleichzeitig inspirierende Persönlichkeit hin. Du packst gerne Dinge an und kannst andere mit deiner Energie und deinen Ideen mitreißen. Achte darauf, dass bei aller Begeisterung die Details nicht zu kurz kommen und du deine Energie fokussiert einsetzt.<br /><br />",
        comboGreenBlue: "<strong>Kombination im Fokus (Grün-Blau):</strong> Diese Kombination weist auf eine gewissenhafte, zuverlässige und detailorientierte Persönlichkeit hin. Du legst Wert auf Qualität, Stabilität und durchdachte Entscheidungen. Manchmal könntest du davon profitieren, etwas flexibler auf neue Situationen zu reagieren und schneller ins Handeln zu kommen.<br /><br />",
        comboRedBlue: "<strong>Kombination im Fokus (Rot-Blau):</strong> Diese Mischung deutet auf eine entschlossene, zielstrebige und analytische Persönlichkeit hin. Du triffst Entscheidungen gerne auf Basis von Fakten und setzt diese dann konsequent um. Es könnte hilfreich sein, die emotionalen Aspekte und die Bedürfnisse anderer bewusster in deine Überlegungen einzubeziehen.<br /><br />",
        comboYellowGreen: "<strong>Kombination im Fokus (Gelb-Grün):</strong> Diese Kombination spricht für eine menschenorientierte, kooperative und optimistische Persönlichkeit. Du schätzt Harmonie und positive Beziehungen und kannst andere gut motivieren. Achte darauf, dass du bei aller Rücksichtnahme deine eigenen Ziele nicht vernachlässigst und auch mal klare Grenzen setzt.<br /><br />",
        lessInFocus: (thirdColorName, thirdPercentage, fourthColorName, fourthPercentage) =>
            `<strong>Weniger im Fokus (${thirdColorName} & ${fourthColorName}):</strong><br />Die Eigenschaften von ${thirdColorName} (${thirdPercentage}%) und insbesondere ${fourthColorName} (${fourthPercentage}%) scheinen in deinem Profil weniger stark ausgeprägt zu sein. Das bedeutet nicht, dass du diese Eigenschaften nicht besitzt, sondern dass sie in deinem typischen Verhalten möglicherweise seltener im Vordergrund stehen. Es kann nützlich sein, sich dieser Bereiche bewusst zu sein, besonders in Situationen, die genau diese Qualitäten erfordern.<br /><br />`,
        conclusion: "Nutze diese Einschätzung als Anregung zur Selbstreflexion. Deine Persönlichkeit ist einzigartig und facettenreich. Viel Spaß beim Entdecken deiner Stärken und Potenziale!"
    },
    privacyPolicyContent: {
        title: "Datenschutzerklärung",
        p1: "Diese Datenschutzerklärung klärt dich über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend „Daten“) innerhalb dieses privaten Onlineangebotes und der mit ihm verbundenen Webseiten, Funktionen und Inhalte auf.",
        responsibleTitle: "Verantwortlicher",
        responsibleText: "Chris Kubisch<br />Hörsterstraße 20<br />D-48143 Münster<br />+4915164579952<br />https://kubisch.digital\n<br/>Es handelt sich hierbei um ein rein privates Projekt ohne kommerzielle Interessen.",
        dataTypesTitle: "Arten der verarbeiteten Daten",
        dataTypesList: [
            "Deine Antworten auf die Fragebogenfragen (anonymisiert).",
            "Deine berechneten Farbtyp-Ergebnisse (anonymisiert).",
            "Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) - Für diese App: Nicht relevant.",
            "Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) - Für diese App: Nicht relevant bei rein clientseitiger Ausführung."
        ],
        processingPurposeTitle: "Zweck der Verarbeitung",
        processingPurposeList: [
            "Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte (Persönlichkeitseinschätzung).",
        ],
        legalBasisTitle: "Rechtsgrundlagen",
        legalBasisText1: "Die Verarbeitung deiner Daten im Rahmen des Fragebogens und zur Generierung der Ergebnisse erfolgt auf Grundlage deiner Einwilligung durch die Nutzung der Anwendung und das Absenden des Fragebogens (Art. 6 Abs. 1 lit. a DSGVO).",
        legalBasisText2: "Da diese Anwendung primär clientseitig läuft und keine Daten dauerhaft auf einem Server gespeichert werden, ist der Fokus auf Transparenz wichtig.",
        dataTransferTitle: "Datenübermittlung an Dritte und Drittanbieter",
        dataTransferText1: "Es werden keine deiner Daten an Dritte weitergegeben, außer dies ist zur Vertragserfüllung notwendig oder es besteht eine gesetzliche Verpflichtung.",
        storageDurationTitle: "Speicherdauer",
        storageDurationText: "Die im Rahmen des Fragebogens eingegebenen Daten und die daraus resultierenden Ergebnisse werden nur temporär im Arbeitsspeicher deines Browsers für die Dauer deiner aktuellen Sitzung gehalten. Beim Schließen des Browser-Tabs oder -Fensters werden diese Daten in der Regel gelöscht, sofern du diese nicht anderweitig (z.B. durch Screenshot) sicherst. Es erfolgt keine serverseitige Speicherung deiner Antworten oder Ergebnisse durch diese Anwendung selbst.",
        yourRightsTitle: "Deine Rechte",
        yourRightsText1: "Da keine personenbezogenen Daten dauerhaft von mir gespeichert werden, sind Auskunfts-, Berichtigungs-, Löschungs- oder Übertragungsrechte deiner Daten gegenüber mir als Betreiber dieser reinen Client-Anwendung nur eingeschränkt relevant.",
        yourRightsText2: "Du hast das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (z.B. indem du die Seite verlässt).",
        cookiesTitle: "Cookies",
        cookiesText: "Diese Anwendung verwendet keine Cookies zur Verfolgung oder Analyse deines Verhaltens.",
        basisDisclaimerPrivacy: "Das dieser Anwendung zugrundeliegende Konzept und die verwendeten Beschreibungen basieren auf öffentlich zugänglichen Informationen und allgemeinen Veröffentlichungen zum Thema Persönlichkeitstests und Farbpsychologie. Es besteht keine Verbindung zu spezifischen, geschützten Testverfahren.",
        finalRemarkTitle: "Schlussbemerkung",
        finalRemarkText: "Diese Datenschutzerklärung dient deiner Information."
    },
    questionTexts: deQuestionTexts,
    ratingLabels: [
      { value: 6, label: "Trifft sehr zu", short: "Sehr zu", suffix: "Absolut" },
      { value: 3, label: "Trifft zu", short: "Zu", suffix: "Ja" },
      { value: 2, label: "Trifft weniger zu", short: "Weniger zu", suffix: "Naja" },
      { value: 0, label: "Trifft am wenigsten zu", short: "Gar nicht", suffix: "Eher nein" },
    ],
    colorDescriptions: {
      Dynamikrot: { name: "Dynamikrot", description: "Deutet Energie, Durchsetzungskraft und Entschlossenheit an. Zielstrebig, energiegeladen, handlungsorientiert.", colorClass: "bg-red-500", textClass: "text-red-600", borderClass: "border-red-500", characteristics: { strengths: "entschlossen, willensstark, ergebnisorientiert, direkt, wettbewerbsorientiert, schnell entscheidend", challenges: "ungeduldig, kann andere überfordern, geringe Detailorientierung bei Routine, risikofreudig, kann Gefühle anderer übersehen", motivation: "Ergebnisse, Herausforderung, Kontrolle, Gewinnen, Unabhängigkeit", communication: "direkt, auf den Punkt, fordernd, ergebnisorientiert"}},
      Freigeistgelb: { name: "Freigeistgelb", description: "Verkörpert Offenheit, Kreativität und Unkonventionalität. Unabhängig, enthusiastisch, ideenreich.", colorClass: "bg-yellow-500", textClass: "text-yellow-600", borderClass: "border-yellow-500", characteristics: { strengths: "enthusiastisch, optimistisch, kreativ, kommunikativ, überzeugend, inspirierend", challenges: "unorganisiert, detailarm, kann zu viel auf einmal wollen, verliert bei Routine schnell Interesse, manchmal oberflächlich", motivation: "Anerkennung, Spaß, soziale Interaktion, neue Ideen, Freiheit", communication: "lebhaft, inspirierend, offen, manchmal abschweifend"}},
      Balancegrün: { name: "Balancegrün", description: "Betonung von Ausgeglichenheit, Harmonie und Stabilität. Harmonisch, ruhig, diplomatisch.", colorClass: "bg-green-500", textClass: "text-green-600", borderClass: "border-green-500", characteristics: { strengths: "geduldig, teamfähig, unterstützend, zuverlässig, loyal, guter Zuhörer", challenges: "konfliktscheu, zögerlich bei Entscheidungen, widerstrebend gegenüber Veränderungen, kann nachtragend sein", motivation: "Harmonie, Sicherheit, Zusammenarbeit, Stabilität, Wertschätzung", communication: "freundlich, rücksichtsvoll, abwägend, manchmal indirekt"}},
      Logikblau: { name: "Logikblau", description: "Steht für Struktur, Rationalität und Klarheit. Analytisch, sachlich, präzise.", colorClass: "bg-blue-500", textClass: "text-blue-600", borderClass: "border-blue-500", characteristics: { strengths: "analytisch, präzise, sorgfältig, faktenorientiert, qualitätsbewusst, systematisch", challenges: "perfektionistisch, kritisch (auch sich selbst gegenüber), kann distanziert wirken, detailverliebt, braucht Zeit für Entscheidungen", motivation: "Logik, Genauigkeit, Fakten, Qualität, klare Strukturen", communication: "sachlich, präzise, datengestützt, manchmal zu detailliert"}},
    },
  },
  en: {
    appName: "ColorCompass – Your Inner Compass",
    startQuiz: "Start Questionnaire",
    next: "Next",
    back: "Back",
    showResults: "Show Results",
    resetSelection: "Reset Selection",
    errorUniqueRating: (ratingLabel) => `The rating "${ratingLabel}" has already been used for another statement in this question. Please choose a unique rating for each statement.`,
    errorCompleteQuestion: "Please rate all four statements with different categories before continuing.",
    resultsTitle: "Your Results",
    typePrefix: "Type:",
    balancedTypeLabel: "Balanced",
    typeNotDetermined: "Not determined",
    typeError: "Error in determination",
    pieChartTitle: "Point Distribution",
    percentageDistributionTitle: "Percentage Distribution",
    noPieData: "No data available for the pie chart.",
    individualAssessmentTitle: "Individual Assessment:",
    generalColorDescriptionsTitle: "General Color Descriptions:",
    importantNoticeTitle: "Important Notice:",
    importantNoticeText: "These results and analyses are for self-reflection and entertainment purposes only. They do not constitute a scientifically validated psychological diagnosis and are not affiliated with or derived from official testing procedures or other protected systems. Please interpret the results thoughtfully.",
    basisDisclaimer: "The concept and content of this application are based on publicly available information and general publications on the subject of personality tests and color psychology.",
    restart: "Restart",
    privacyPolicyLink: "Privacy Policy",
    privacyPolicyButtonClose: "Close",
    progressLabel: "Progress",
    questionLabel: (current, total) => `Question ${current}${total ? ` of ${total}` : ''}`,
    ratingTableHeader: "Statement",
    ratingTableRatingColHeader: "Applies to", 
    noResultsYet: "Please complete the questionnaire first to see your results.",
    shareableResultTitle: "Your Shareable Color Profile:",
    copyTypeButtonLabel: "Copy Type Visual",
    copiedMessage: "Copied!",
    introductionPage: { 
        appShortDescription: "Discover your professional personality preferences and get an initial assessment of your color type.",
        welcomeMessage: "This questionnaire helps you discover your personality preferences based on four different color types:",
        instructionsHeader: "For each of the following questions, you will see four statements. Please rate each statement according to how much it applies to you by assigning one of the following categories to each statement:",
        ratingExplanation: {
            6: "This describes you very well.",
            3: "This applies to you.",
            2: "This applies less to you.",
            0: "This hardly or not at all describes you."
        },
        importantInstruction: "Important: Within each question, each rating category (e.g., \"Applies very much\") must be assigned exactly once. You cannot rate two statements as \"Applies very much\".",
        noticeTitle: "Please note:",
        noticeText1: "This questionnaire is a tool for self-reflection and is intended for entertainment. This is a purely private project.",
        noticeText2: "The color types and descriptions used here are simplified models and are not directly related to protected systems or other established personality tests.",
        noticeText3: "The results should be understood as a suggestion and not as a definitive assessment of your personality."
    },
    assessmentTextParts: { 
        noScores: "Results could not be calculated as no points were awarded. Please complete the questionnaire.",
        balancedProfileIntro: "Your answers suggest a <strong>balanced personality profile</strong>, where no single color strongly dominates. This indicates remarkable versatility and adaptability. You seem capable of utilizing different strengths and approaches depending on the situation.<br /><br />",
        balancedDistribution: "The percentage distribution of your color components is as follows: <br />",
        balancedStrongestEmphasis: (firstColorName, firstColorStrength1, firstColorStrength2, firstColorMotivation, secondColorName, secondColorPercentage) =>
            `Within this balance, the preference for <strong>${firstColorName}</strong> is nonetheless most discernible. This suggests you tend to exhibit qualities like ${firstColorStrength1} and ${firstColorStrength2} somewhat more frequently. Your motivation might often be guided by aspects such as ${firstColorMotivation}. The characteristics of the second strongest color, <strong>${secondColorName}</strong> (${secondColorPercentage}%), round off your profile and offer additional flexibility.<br /><br />`,
        balancedGeneralEmphasis: (firstColorName, firstColorPercentage, secondColorName, secondColorPercentage) =>
            `The qualities of <strong>${firstColorName}</strong> (${firstColorPercentage}%) and <strong>${secondColorName}</strong> (${secondColorPercentage}%) are most present in your profile and often work in tandem. This indicates a flexible combination of their respective strengths.<br /><br />`,
        balancedAdvice: "Your balance is a strength that allows you to act flexibly. Ensure that this flexibility doesn't lead to indecisiveness when clear positioning is required. Sometimes, consciously emphasizing one of your stronger preferences can be helpful to achieve goals or make decisions.<br /><br />",
        dominantProfileIntro: (firstColorName, firstPercentage, secondColorName, secondPercentage) =>
            `Your answers indicate a personality profile where <strong>${firstColorName}</strong> (${firstPercentage}%) is most prominent, followed by <strong>${secondColorName}</strong> (${secondPercentage}%).<br /><br />`,
        dominantPreference: (colorName, strengths, motivation, communication, challenges) =>
            `<strong>Dominant Preference: ${colorName}</strong><br />Individuals with a high preference for ${colorName} are often ${strengths}. They are motivated by ${motivation} and typically communicate ${communication}. Potential challenges or areas for development could include ${challenges}.<br /><br />`,
        secondaryPreference: (colorName, strengths, motivation, communication, challenges) =>
            `<strong>Second Strongest Preference: ${colorName}</strong><br />Your second strongest preference, ${colorName}, complements your profile. Typical strengths here are ${strengths}. Motivation is often driven by ${motivation}. Communication is usually ${communication}. Pay attention to potential pitfalls like ${challenges}.<br /><br />`,
        comboRedYellow: "<strong>Combination in Focus (Red-Yellow):</strong> This mix suggests a very dynamic, results-oriented, and simultaneously inspiring personality. You enjoy tackling things and can sweep others along with your energy and ideas. Ensure that details are not overlooked amidst all the enthusiasm and that you use your energy in a focused manner.<br /><br />",
        comboGreenBlue: "<strong>Combination in Focus (Green-Blue):</strong> This combination indicates a conscientious, reliable, and detail-oriented personality. You value quality, stability, and well-thought-out decisions. Sometimes, you might benefit from reacting more flexibly to new situations and acting more quickly.<br /><br />",
        comboRedBlue: "<strong>Combination in Focus (Red-Blue):</strong> This mix suggests a decisive, goal-oriented, and analytical personality. You prefer to make decisions based on facts and then implement them consistently. It could be helpful to more consciously include emotional aspects and the needs of others in your considerations.<br /><br />",
        comboYellowGreen: "<strong>Combination in Focus (Yellow-Green):</strong> This combination speaks for a people-oriented, cooperative, and optimistic personality. You value harmony and positive relationships and can motivate others well. Ensure that you do not neglect your own goals while being considerate and also set clear boundaries at times.<br /><br />",
        lessInFocus: (thirdColorName, thirdPercentage, fourthColorName, fourthPercentage) =>
            `<strong>Less in Focus (${thirdColorName} & ${fourthColorName}):</strong><br />The characteristics of ${thirdColorName} (${thirdPercentage}%) and especially ${fourthColorName} (${fourthPercentage}%) seem less pronounced in your profile. This doesn't mean you don't possess these traits, but they may be less prominent in your typical behavior. It can be useful to be aware of these areas, especially in situations that require these specific qualities.<br /><br />`,
        conclusion: "Use this assessment as an impetus for self-reflection. Your personality is unique and multifaceted. Enjoy discovering your strengths and potentials!"
    },
    privacyPolicyContent: { 
        title: "Privacy Policy",
        p1: "This Privacy Policy informs you about the nature, scope, and purpose of the processing of personal data (hereinafter “Data”) within this private online offering and its associated websites, functions, and content.",
        responsibleTitle: "Controller",
        responsibleText: "Chris Kubisch<br />Hörsterstraße 20<br />D-48143 Münster<br />+4915164579952<br />https://kubisch.digital\n<br/>This is a purely private project without commercial interests.",
        dataTypesTitle: "Types of Data Processed",
        dataTypesList: [ "Responses to questionnaire questions (anonymized).", "Calculated color type results (anonymized).", "Usage data (e.g., visited web pages, interest in content, access times) - not relevant for this app.", "Meta/communication data (e.g., device information, IP addresses) - not relevant for this app for purely client-side execution without server interaction other than API calls." ],
        processingPurposeTitle: "Purpose of Processing",
        processingPurposeList: [ "Provision of the Online Offering, its functions, and content (personality assessment).", ],
        legalBasisTitle: "Legal Basis",
        legalBasisText1: "The processing of your data within the scope of the questionnaire and for generating the results is based on your implicit consent through the use of the application and submission of the questionnaire (Art. 6 Para. 1 lit. a GDPR).",
        legalBasisText2: "Since this application primarily runs client-side and no data is permanently stored on a server, transparency is important.",
        dataTransferTitle: "Data Transfer to Third Parties and Third-Party Providers",
        dataTransferText1: "No data is transferred to third parties unless this is necessary for contract fulfillment or there is a legal obligation to do so.",
        storageDurationTitle: "Storage Duration",
        storageDurationText: "The data entered in the questionnaire and the resulting outcomes are only temporarily held in your browser's memory for the duration of your current session. When you close the browser tab or window, this data is usually deleted, unless you save it otherwise (e.g., by screenshot). There is no server-side storage of your answers or results by this application itself.",
        yourRightsTitle: "Your Rights",
        yourRightsText1: "Since no personal data is permanently stored by us, rights of access, rectification, erasure, or data portability concerning your data are only of limited relevance with respect to us as the operator of this purely client-side application.",
        yourRightsText2: "You have the right to withdraw any consent given at any time with effect for the future (e.g., by leaving the page).",
        cookiesTitle: "Cookies",
        cookiesText: "This application does not use cookies to track or analyze your behavior.",
        basisDisclaimerPrivacy: "The concept and content of this application are based on publicly available information and general publications on the subject of personality tests and color psychology. There is no connection to specific, protected testing procedures.",
        finalRemarkTitle: "Final Remark",
        finalRemarkText: "This privacy policy is for your information."
    },
    questionTexts: enQuestionTexts, 
    ratingLabels: [
      { value: 6, label: "Applies very much", short: "Very much", suffix: "Absolutely", mobileSuffix: "Absolutely" },
      { value: 3, label: "Applies", short: "Applies", suffix: "Yes", mobileSuffix: "Yes" },
      { value: 2, label: "Applies less", short: "Less so", suffix: "So-so", mobileSuffix: "So-so" },
      { value: 0, label: "Applies least", short: "Not at all", suffix: "Rather not", mobileSuffix: "Rather not" },
    ],
    colorDescriptions: {
      Dynamikrot: { name: "Dynamic Red", description: "Suggests energy, assertiveness, and determination. Goal-oriented, energetic, action-oriented.", colorClass: "bg-red-500", textClass: "text-red-600", borderClass: "border-red-500", characteristics: { strengths: "decisive, strong-willed, results-oriented, direct, competitive, quick decision-maker", challenges: "impatient, can overwhelm others, low detail orientation in routine tasks, risk-taker, can overlook others' feelings", motivation: "results, challenge, control, winning, independence", communication: "direct, to the point, demanding, results-oriented"}},
      Freigeistgelb: { name: "Free-Spirit Yellow", description: "Embodies openness, creativity, and unconventionality. Independent, enthusiastic, imaginative.", colorClass: "bg-yellow-500", textClass: "text-yellow-600", borderClass: "border-yellow-500", characteristics: { strengths: "enthusiastic, optimistic, creative, communicative, persuasive, inspiring", challenges: "disorganized, lacks attention to detail, may want too much at once, quickly loses interest in routine, sometimes superficial", motivation: "recognition, fun, social interaction, new ideas, freedom", communication: "lively, inspiring, open, sometimes rambling"}},
      Balancegrün: { name: "Balanced Green", description: "Emphasizes balance, harmony, and stability. Harmonious, calm, diplomatic.", colorClass: "bg-green-500", textClass: "text-green-600", borderClass: "border-green-500", characteristics: { strengths: "patient, team player, supportive, reliable, loyal, good listener", challenges: "conflict-avoidant, hesitant in decision-making, resistant to change, can be resentful", motivation: "harmony, security, cooperation, stability, appreciation", communication: "friendly, considerate, deliberative, sometimes indirect"}},
      Logikblau: { name: "Logic Blue", description: "Stands for structure, rationality, and clarity. Analytical, factual, precise.", colorClass: "bg-blue-500", textClass: "text-blue-600", borderClass: "border-blue-500", characteristics: { strengths: "analytical, precise, meticulous, fact-oriented, quality-conscious, systematic", challenges: "perfectionistic, critical (also of oneself), can appear distant, detail-obsessed, needs time for decisions", motivation: "logic, accuracy, facts, quality, clear structures", communication: "factual, precise, data-driven, sometimes too detailed"}},
    },
  }
};
translations.de.questions = createTranslatedQuestions(translations.de.questionTexts);
translations.en.questions = createTranslatedQuestions(translations.en.questionTexts);
// --- END TRANSLATIONS ---

const COLOR_HEX_MAP = { 
  Dynamikrot: '#ef4444',
  Freigeistgelb: '#f59e0b',
  Balancegrün: '#22c55e',
  Logikblau: '#3b82f6',
};

function getColorCompassType(percentageResults, totalUserScore) {
  if (totalUserScore === 0 || !percentageResults || percentageResults.length === 0) {
    return { typeString: "Nicht ermittelt", isBalanced: false, internalKey: "not_determined" }; 
  }

  const initialsMap = {
    Dynamikrot: 'D',
    Freigeistgelb: 'F',
    Balancegrün: 'B',
    Logikblau: 'L',
  };
  
  const sortedPercentages = percentageResults; 

  const first = sortedPercentages[0];
  if (!first) { 
    console.error("Fehler in getColorCompassType: sortedPercentages ist leer.");
    return { typeString: "Fehler bei Ermittlung", isBalanced: false, internalKey: "error" };
  }

  const isTrulyBalanced = first.percentage < 30;
  if (isTrulyBalanced) {
    const typeStringInternal = `(${sortedPercentages.map(p => initialsMap[p.name] ? initialsMap[p.name].toLowerCase() : '?').join('')})`;
    return { typeString: typeStringInternal, isBalanced: true, internalKey: "balanced" };
  }
  
  let typeChars = [];
  const primaryDominantThreshold = 38; 
  const secondaryDominantThreshold = 30; 
  const closePairThreshold = 10;

  sortedPercentages.forEach((p, index) => {
    let initial = initialsMap[p.name];
    if (!initial) { 
      console.error("Unbekannter Farbname in getColorCompassType:", p.name);
      typeChars.push('?');
      return;
    }

    if (index === 0 && p.percentage >= primaryDominantThreshold) {
      initial = initial.toUpperCase();
    } else if (index === 0 && p.percentage >= secondaryDominantThreshold) { 
        initial = initial.toUpperCase();
    } else if (index === 1 && p.percentage >= secondaryDominantThreshold && (sortedPercentages[0].percentage - p.percentage < closePairThreshold)) {
      initial = initial.toUpperCase();
    } else {
      initial = initial.toLowerCase();
    }
    typeChars.push(initial);
  });
  const typeStringInternal = typeChars.join('-');
  return { typeString: typeStringInternal, isBalanced: false, internalKey: typeStringInternal };
}


// Component for Language Switcher
const LanguageSwitcher = ({ currentLanguage, onChangeLanguage }) => {
    return (
        <div className="absolute top-4 right-4 z-20">
            <button
                onClick={() => onChangeLanguage('de')}
                disabled={currentLanguage === 'de'}
                className={`px-3 py-1.5 rounded-l-md text-sm font-medium transition-colors duration-150
                    ${currentLanguage === 'de' ? 'bg-indigo-600 text-white cursor-default' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-300'}`}
            >
                DE
            </button>
            <button
                onClick={() => onChangeLanguage('en')}
                disabled={currentLanguage === 'en'}
                className={`px-3 py-1.5 rounded-r-md text-sm font-medium transition-colors duration-150
                    ${currentLanguage === 'en' ? 'bg-indigo-600 text-white cursor-default' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-300 border-l-0'}`}
            >
                EN
            </button>
        </div>
    );
};


// Component for Introduction Page
const IntroductionPage = ({ onStartQuiz, currentLangData }) => {
  const { introductionPage, colorDescriptions: currentCDs, ratingLabels: currentRLs, appName, startQuiz } = currentLangData;
  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl text-center animate-fadeIn">
      <img src="/logo192.png" alt="App Logo" className="mx-auto mb-4" /> {/* Updated Logo Path */}
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">{appName}</h1>
      <p className="text-base md:text-lg text-gray-700 mb-6">
        {introductionPage.appShortDescription}
      </p>
      {/* Removed redundant welcomeMessage paragraph */}
      <div className="flex justify-center mb-6 md:mb-8">
        <table className="w-full mx-auto">
          <tbody>
            {Object.entries(currentCDs).map(([key, desc]) => (
              <tr key={key} className="border-b last:border-b-0 border-gray-100">
                <td className="py-2 md:py-3 pr-2 md:pr-4 text-right">
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full inline-block align-middle shadow-sm ${desc.colorClass}`}></div>
                </td>
                <td className={`py-2 md:py-3 text-left font-semibold ${desc.textClass} pr-2 md:pr-4 text-sm md:text-base whitespace-nowrap`}>
                  {desc.name}:
                </td>
                <td className="py-2 md:py-3 text-left text-gray-700 text-sm md:text-base">
                  {desc.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-base md:text-lg text-gray-700 mb-6">
        {introductionPage.instructionsHeader}
      </p>
      <div className="text-left text-gray-700 mb-8 w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
        {currentRLs.map(rl => (
          <div key={rl.value} className="flex flex-col sm:flex-row sm:items-start mb-2 sm:mb-1 last:mb-0">
            <span className="font-semibold sm:w-48 shrink-0 text-sm md:text-base">{rl.label}:</span>
            <span className="whitespace-normal text-sm md:text-base sm:ml-2">
              {introductionPage.ratingExplanation[rl.value]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-base md:text-lg text-gray-700 mb-4 font-semibold">
        {introductionPage.importantInstruction}
      </p>
      <div className="my-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg text-sm shadow">
        <h3 className="font-bold mb-2">{introductionPage.noticeTitle}</h3>
        <p>{introductionPage.noticeText1}</p>
        <p>{introductionPage.noticeText2}</p>
        <p>{introductionPage.noticeText3}</p>
      </div>
      <button
        onClick={() => onStartQuiz(true)}
        className="px-8 py-3 md:py-4 bg-green-600 text-white rounded-lg font-semibold text-lg md:text-xl hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {startQuiz}
      </button>
    </div>
  );
};

// Component for Displaying Questions
const QuestionDisplay = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  shuffledOptions,
  currentQuestionRatings,
  handleRatingChange,
  errorMessage,
  handleBack,
  handleResetCurrentQuestion,
  handleNext,
  isCurrentQuestionComplete,
  currentLangData
}) => {
  const { progressLabel, questionLabel, ratingTableHeader, ratingTableRatingColHeader, back, resetSelection, next, showResults } = currentLangData;
  const currentRatingLabels = currentLangData.ratingLabels;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (!currentQuestion) { 
    return <div className="text-center p-8">Loading question...</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl">
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
          <span>{progressLabel}</span>
          <span>{questionLabel(currentQuestionIndex + 1, totalQuestions)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            role="progressbar"
            aria-label={`${progressLabel}: ${progressPercentage.toFixed(0)}%`}
          ></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
        {questionLabel(currentQuestionIndex + 1, '')} 
      </h2>
      <p className="text-lg md:text-xl font-medium text-gray-700 mb-6 md:mb-8 text-center">{currentQuestion.text}</p>

      {errorMessage && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative mb-6 shadow animate-shake"
          role="alert"
          aria-live="assertive"
        >
          <strong className="font-bold">{currentLangData.importantNoticeTitle || "Hinweis:"} </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full w-full bg-white table-fixed">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs md:text-sm leading-normal">
              <th className="py-3 px-2 md:px-4 text-left w-[calc(100%-360px)] lg:w-[calc(100%-440px)]">{ratingTableHeader}</th>
              {currentRatingLabels.map((rating) => (
                <th key={rating.value} className="py-3 px-2 md:px-3 text-center w-[90px] lg:w-[110px]" title={rating.label}>
                    {ratingTableRatingColHeader}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm md:text-base">
            {shuffledOptions.map((option) => {
              const selectedScore = currentQuestionRatings[option.id];
              const usedScoresInQuestion = new Set(Object.values(currentQuestionRatings));
              return (
                <tr key={option.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-2 md:px-4 text-left whitespace-normal break-words font-semibold">
                    {option.text}
                  </td>
                  {currentRatingLabels.map((rating) => (
                    <td key={rating.value} className="py-2 px-1 md:px-2 text-center">
                      <button
                        onClick={() => handleRatingChange(option.id, rating.value)}
                        aria-label={`Bewerte "${option.text}" als "${rating.label}"`}
                        title={`Bewerte "${option.text}" als "${rating.label}"`}
                        className={`
                          w-full h-10 md:h-12 flex items-center justify-center rounded-md transition-all duration-200 ease-in-out 
                          text-xs md:text-sm px-1 md:px-2 leading-tight text-center focus:outline-none focus:ring-2 focus:ring-offset-1
                          transform hover:scale-105 active:scale-95
                          ${selectedScore === rating.value
                            ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
                          }
                          ${(usedScoresInQuestion.has(rating.value) && selectedScore !== rating.value)
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:shadow-sm'
                          }
                        `}
                        disabled={usedScoresInQuestion.has(rating.value) && selectedScore !== rating.value}
                      >
                          {rating.suffix} {/* Using suffix for desktop as well now */}
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 mt-4">
        <p className="text-center font-medium text-gray-600">{ratingTableRatingColHeader}</p>
        {shuffledOptions.map((option) => {
          const selectedScore = currentQuestionRatings[option.id];
          const usedScoresInQuestion = new Set(Object.values(currentQuestionRatings));
          return (
            <div key={option.id} className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200">
              <p className="font-semibold text-gray-800 mb-3">{option.text}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentRatingLabels.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => handleRatingChange(option.id, rating.value)}
                    aria-label={`Bewerte "${option.text}" als "${rating.label}"`}
                    title={rating.label}
                    className={`
                      w-full h-12 flex items-center justify-center rounded-md transition-all duration-200 ease-in-out 
                      text-sm px-2 leading-tight text-center focus:outline-none focus:ring-2 focus:ring-offset-1
                      transform hover:scale-105 active:scale-95
                      ${selectedScore === rating.value
                        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-indigo-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
                      }
                      ${(usedScoresInQuestion.has(rating.value) && selectedScore !== rating.value)
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:shadow-sm'
                      }
                    `}
                    disabled={usedScoresInQuestion.has(rating.value) && selectedScore !== rating.value}
                  >
                    {rating.suffix} {/* Using suffix for mobile as well now */}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>


      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ease-in-out border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
        >
          {back}
        </button>
        <button
          onClick={handleResetCurrentQuestion}
          className="w-full sm:w-auto px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-semibold text-sm md:text-base hover:bg-yellow-600 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1"
        >
          {resetSelection}
        </button>
        <button
          onClick={handleNext}
          disabled={!isCurrentQuestionComplete}
          className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ease-in-out bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
        >
          {currentQuestionIndex === totalQuestions - 1 ? showResults : next}
        </button>
      </div>
    </div>
  );
};

// Component for Shareable Type Visualization
const ShareableTypeVisual = ({ sortedResults, colorDescriptions, colorHexMap, typeString, currentLangData }) => {
    const [copiedStatus, setCopiedStatus] = useState('');

    const colorEmojiMap = {
        Dynamikrot: '🔴',
        Freigeistgelb: '🟡',
        Balancegrün: '🟢',
        Logikblau: '🔵',
    };

    const initialsMap = {
        Dynamikrot: 'D',
        Freigeistgelb: 'F',
        Balancegrün: 'B',
        Logikblau: 'L',
    };
    
    const handleCopy = () => {
        // Use the appName for the title of the copied text
        let textToCopy = `${currentLangData.appName} - ${currentLangData.resultsTitle}\n`;
        textToCopy += sortedResults.map(item => {
            const initial = initialsMap[item.name];
            return `${colorEmojiMap[item.name]}${item.percentage >= 30 ? initial.toUpperCase() : initial.toLowerCase()}`;
        }).join(' ') + '\n';
        // Use the already translated and formatted typeString from colorCompassTypeInfo
        textToCopy += `${typeString}\n`; 
        sortedResults.forEach(item => {
            textToCopy += `${colorDescriptions[item.name].name}: ${item.percentage.toFixed(1)}%\n`;
        });

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            setCopiedStatus(currentLangData.copiedMessage);
        } catch (err) {
            console.error('Kopieren fehlgeschlagen:', err);
            setCopiedStatus('Fehler beim Kopieren'); // Fallback message
        }
        document.body.removeChild(textarea);
        setTimeout(() => setCopiedStatus(''), 2000);
    };

    return (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 text-center">{currentLangData.shareableResultTitle}</h3>
            <div className="flex justify-center space-x-2 mb-4">
                {sortedResults.map(item => {
                    const initial = initialsMap[item.name];
                    const displayInitial = item.percentage >= 30 ? initial.toUpperCase() : initial.toLowerCase();
                    return (
                        <div key={item.name}
                             title={`${colorDescriptions[item.name].name}: ${item.percentage.toFixed(1)}%`}
                             className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md ${colorDescriptions[item.name].colorClass}`}
                             style={{ backgroundColor: colorHexMap[item.name]}} 
                        >
                            {displayInitial}
                        </div>
                    );
                })}
            </div>
            <div className="text-center">
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                    {currentLangData.copyTypeButtonLabel}
                </button>
                {copiedStatus && <p className="text-sm text-green-600 mt-2">{copiedStatus}</p>}
            </div>
        </div>
    );
};


// Component for Displaying Results
const ResultsDisplay = ({ 
    finalResults, 
    colorCompassType, 
    individualAssessmentText, 
    handleRestart,
    currentLangData,
    colorHexMap 
}) => {
  const { 
    resultsTitle, pieChartTitle, percentageDistributionTitle, noPieData, individualAssessmentTitle, 
    generalColorDescriptionsTitle, 
    importantNoticeTitle, importantNoticeText, basisDisclaimer, restart, noResultsYet
  } = currentLangData;
  const currentCDs = currentLangData.colorDescriptions;

  const totalUserScore = Object.values(finalResults).reduce((sum, score) => sum + score, 0);

  let pieChartData = totalUserScore > 0 
    ? Object.keys(finalResults).map(colorKey => ({
        name: colorKey,
        value: finalResults[colorKey] < 0 ? 0 : finalResults[colorKey],
        percentage: parseFloat(((finalResults[colorKey] / totalUserScore) * 100).toFixed(1)),
        score: finalResults[colorKey] 
      }))
    : [];
 
  const customPieOrder = ['Dynamikrot', 'Freigeistgelb', 'Balancegrün', 'Logikblau'];
  const pieChartDataOrdered = [...pieChartData].sort((a, b) => customPieOrder.indexOf(a.name) - customPieOrder.indexOf(b.name));
  const pieChartDataForChart = pieChartDataOrdered.filter(item => item.value > 0.01); 

  const pieChartDataSortedByPercentage = [...pieChartData].sort((a,b) => b.percentage - a.percentage);

  return (
    <div id="results-page-content" className="bg-white p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">{resultsTitle}</h2>
      {totalUserScore > 0 && pieChartDataSortedByPercentage.length > 0 && currentCDs[pieChartDataSortedByPercentage[0]?.name] && (
          <p className={`text-xl font-semibold ${currentCDs[pieChartDataSortedByPercentage[0]?.name]?.textClass || 'text-indigo-600'} mb-6 text-center`}>{colorCompassType.typeString}</p>
      )}

      {totalUserScore > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-2 h-64 md:h-80 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 text-center">{pieChartTitle}</h3>
            {pieChartDataForChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieChartDataForChart} 
                    cx="50%"
                    cy="50%"
                    innerRadius="45%" 
                    outerRadius="80%" 
                    fill="#8884d8"
                    startAngle={90}
                    endAngle={-270} 
                    paddingAngle={pieChartDataForChart.length > 1 ? 2 : 0} 
                    dataKey="value"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.55; 
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        if (percent * 100 < 3) return null; 
                        return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="10px" fontWeight="bold">
                            {`${currentCDs[name].name.substring(0,1)}${(percent * 100).toFixed(0)}%`}
                        </text>
                        );
                    }}
                    >
                    {pieChartDataForChart.map((entry) => ( 
                        <Cell key={`cell-${entry.name}`} fill={colorHexMap[entry.name]} stroke="#ffffff" strokeWidth={1} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${props.payload.percentage.toFixed(1)}% (${props.payload.score} Pkt.)`, currentCDs[name].name]}/>
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-600 flex items-center justify-center h-full">{noPieData}</p>
            )}
            </div>

            <div className="lg:col-span-3 bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 text-center">{percentageDistributionTitle}</h3>
                {pieChartDataSortedByPercentage.map(item => {
                    const barDisplayPercentage = Math.min(100, (item.percentage / 60) * 100);
                    return (
                        <div key={item.name} className="flex items-center mb-3">
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full mr-2 md:mr-3 shrink-0 ${currentCDs[item.name].colorClass}`}></div>
                            <span className="text-sm md:text-base font-medium text-gray-800 w-28 md:w-32 shrink-0">{currentCDs[item.name].name}:</span>
                            <div className="flex-grow bg-gray-200 rounded-full h-5 md:h-6 relative overflow-hidden" title={`${item.percentage.toFixed(1)}% (${item.score} Punkte)`}>
                            <div
                                className={`${currentCDs[item.name].colorClass} h-full rounded-l-full flex items-center justify-end pr-2 transition-all duration-700 ease-out`}
                                style={{ width: `${Math.max(0, barDisplayPercentage)}%`, minWidth: barDisplayPercentage > 0.1 ? '18px' : '0px' }} 
                            >
                                <span className="text-xs font-semibold text-white opacity-90 ml-1">{item.percentage > 7 ? `${item.percentage.toFixed(1)}%` : ''}</span>
                            </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>

          <ShareableTypeVisual 
            sortedResults={pieChartDataSortedByPercentage}
            colorDescriptions={currentCDs}
            colorHexMap={colorHexMap}
            typeString={colorCompassType.typeString}
            currentLangData={currentLangData}
          />
         
          <div className="mb-8 mt-8"> 
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">{individualAssessmentTitle}</h3>
            <div className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-200 prose prose-sm sm:prose-base max-w-none shadow" dangerouslySetInnerHTML={{ __html: individualAssessmentText }}></div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-700 my-10">
          <p className="text-xl mb-4">{noResultsYet}</p>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}
     
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">{generalColorDescriptionsTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(currentCDs).map((desc) => (
            <div key={desc.name} className={`p-4 border-l-4 ${desc.borderClass} rounded-r-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <h4 className={`text-lg md:text-xl font-bold ${desc.textClass} flex items-center`}>
                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full mr-2 ${desc.colorClass}`}></div>
                {desc.name}
              </h4>
              <p className="text-gray-700 mt-2 text-sm md:text-base">{desc.description}</p>
            </div>
          ))}
        </div>
      </div>
     
      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg text-sm shadow">
        <p><strong>{importantNoticeTitle}</strong> {importantNoticeText}</p>
        <p className="mt-2">{basisDisclaimer}</p>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold text-base md:text-lg hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {restart}
        </button>
      </div>
    </div>
  );
};

// Component for Privacy Policy Page
const PrivacyPolicyPage = ({ onClose, currentLangData }) => {
    const ppContent = currentLangData.privacyPolicyContent;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto prose prose-sm sm:prose-base">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{ppContent.title}</h2>
                <p>{ppContent.p1}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.responsibleTitle}</h3>
                <p dangerouslySetInnerHTML={{ __html: ppContent.responsibleText.replace(/\n/g, '<br/>') }}></p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.dataTypesTitle}</h3>
                <ul>{ppContent.dataTypesList.map((item, i) => <li key={i}>{item}</li>)}</ul>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.processingPurposeTitle}</h3>
                <ul>{ppContent.processingPurposeList.map((item, i) => <li key={i}>{item}</li>)}</ul>
                {/* Removed API Info as AI functionality is removed */}
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.legalBasisTitle}</h3>
                <p>{ppContent.legalBasisText1}</p>
                <p>{ppContent.legalBasisText2}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.dataTransferTitle}</h3>
                <p>{ppContent.dataTransferText1}</p>
                {/* Removed API specific transfer texts */}
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.storageDurationTitle}</h3>
                <p>{ppContent.storageDurationText}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.yourRightsTitle}</h3>
                <p>{ppContent.yourRightsText1}</p>
                <p>{ppContent.yourRightsText2}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.cookiesTitle}</h3>
                <p>{ppContent.cookiesText}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{currentLangData.basisDisclaimer}</h3> {/* Using the general disclaimer key */}
                <p>{ppContent.basisDisclaimerPrivacy}</p> {/* Specific text for privacy page */}
                <h3 className="text-xl font-semibold mt-4 mb-2">{ppContent.finalRemarkTitle}</h3>
                <p>{ppContent.finalRemarkText}</p>
                <button
                    onClick={onClose}
                    className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {currentLangData.privacyPolicyButtonClose}
                </button>
            </div>
        </div>
    );
};

// Footer Component
const Footer = ({ onShowPrivacy, currentLangData }) => {
    return (
        <footer className="w-full text-center p-4 mt-auto">
            <button 
                onClick={onShowPrivacy} 
                className="text-xs text-gray-500 hover:text-indigo-600 hover:underline"
            >
                {currentLangData.privacyPolicyLink}
            </button>
        </footer>
    );
};


function App() {
  const [language, setLanguage] = useState('de'); 
  const [currentLangData, setCurrentLangData] = useState(translations[language]);

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState(() => 
    currentLangData.questions.map(q => ({ questionId: q.id, ratings: {} }))
  );

  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]);
  // Removed AI Analysis state
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    const newLangData = translations[language];
    setCurrentLangData(newLangData);
    if (!quizStarted) {
        setAnswers(newLangData.questions.map(q => ({ questionId: q.id, ratings: {} })));
    }
  }, [language, quizStarted]);


  useEffect(() => {
    if (quizStarted && currentLangData.questions && currentQuestionIndex < currentLangData.questions.length && !showResults && !showPrivacyPolicy) {
      const currentQuestion = currentLangData.questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.options) { 
        setShuffledOptions(shuffleArray([...currentQuestion.options]));
      } else {
        setShuffledOptions([]); 
      }
    }
  }, [currentQuestionIndex, quizStarted, showResults, showPrivacyPolicy, currentLangData]);

  const handleRatingChange = useCallback((optionId, score) => {
    const currentQuestionRatings = answers[currentQuestionIndex]?.ratings || {}; 
    const existingScores = Object.values(currentQuestionRatings);

    if (existingScores.includes(score) && currentQuestionRatings[optionId] !== score) {
      const ratingLabel = currentLangData.ratingLabels.find(r => r.value === score)?.label || score;
      setErrorMessage(currentLangData.errorUniqueRating(ratingLabel));
      return;
    }
    setErrorMessage('');
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      if (!newAnswers[currentQuestionIndex] && currentLangData.questions[currentQuestionIndex]) { 
          newAnswers[currentQuestionIndex] = { questionId: currentLangData.questions[currentQuestionIndex].id, ratings: {} };
      }
      if (newAnswers[currentQuestionIndex]) { 
        newAnswers[currentQuestionIndex] = {
          ...newAnswers[currentQuestionIndex],
          ratings: {
            ...(newAnswers[currentQuestionIndex].ratings || {}), 
            [optionId]: score,
          },
        };
      }
      return newAnswers;
    });
  }, [answers, currentQuestionIndex, currentLangData]);

  const isCurrentQuestionComplete = useMemo(() => {
    if (!currentLangData.questions || !currentLangData.questions[currentQuestionIndex] || !answers[currentQuestionIndex] || !answers[currentQuestionIndex].ratings) return false;
    const currentQuestionRatings = answers[currentQuestionIndex].ratings;
    const ratedOptionsCount = Object.keys(currentQuestionRatings).length;
    const uniqueScores = new Set(Object.values(currentQuestionRatings)).size;
    
    const currentQuestionOptionsCount = currentLangData.questions[currentQuestionIndex]?.options?.length || 0;
    return ratedOptionsCount === currentQuestionOptionsCount && uniqueScores === currentQuestionOptionsCount && currentQuestionOptionsCount > 0;
  }, [answers, currentQuestionIndex, currentLangData]);

  const handleNext = useCallback(() => {
    if (!isCurrentQuestionComplete) {
        setErrorMessage(currentLangData.errorCompleteQuestion);
        return;
    }
    setErrorMessage('');
    if (currentQuestionIndex < currentLangData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  }, [isCurrentQuestionComplete, currentQuestionIndex, currentLangData]);

  const handleBack = useCallback(() => {
    setErrorMessage('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  }, [currentQuestionIndex]);
 
  const handleResetCurrentQuestion = useCallback(() => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      if (newAnswers[currentQuestionIndex]) {
        newAnswers[currentQuestionIndex] = {
          ...newAnswers[currentQuestionIndex],
          ratings: {}, 
        };
      }
      return newAnswers;
    });
    setErrorMessage(''); 
  }, [currentQuestionIndex]);

  const handleRestart = useCallback(() => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    if (currentLangData && currentLangData.questions) {
        setAnswers(currentLangData.questions.map(q => ({ questionId: q.id, ratings: {} })));
    } else {
        setAnswers([]); 
    }
    setShowResults(false);
    setErrorMessage('');
    setShowPrivacyPolicy(false);
  }, [currentLangData]);

  const calculateResults = useMemo(() => {
    const totalScores = {
      Dynamikrot: 0,
      Freigeistgelb: 0,
      Balancegrün: 0,
      Logikblau: 0,
    };
    const localQuestionsData = currentLangData.questions;
    if (!localQuestionsData) return totalScores; 

    answers.forEach(questionAnswer => {
      if (!questionAnswer || !questionAnswer.ratings) return;
      const question = localQuestionsData.find(q => q.id === questionAnswer.questionId);
      if (!question || !question.options) return; 

      Object.entries(questionAnswer.ratings).forEach(([optionId, userScore]) => {
        const option = question.options.find(opt => opt.id === optionId);
        if (option && option.scores) { 
          Object.keys(totalScores).forEach(color => {
            totalScores[color] += (option.scores[color] || 0) * userScore;
          });
        }
      });
    });
    return totalScores;
  }, [answers, currentLangData]);

  const getIndividualAssessmentText = useCallback((results, typeInfo) => {
    const { assessmentTextParts, colorDescriptions: currentCDs } = currentLangData;
    const totalUserScore = Object.values(results).reduce((sum, score) => sum + score, 0);
    
    if (totalUserScore === 0 && Object.values(results).every(s => s === 0)) { 
        return assessmentTextParts.noScores;
    }
    
    const allColorKeys = Object.keys(currentCDs); 
    let percentageResults = allColorKeys.map(colorKey => {
        const score = results[colorKey] || 0; 
        return {
            name: colorKey, 
            score: score,
            percentage: totalUserScore > 0 ? ((score / totalUserScore) * 100) : 0,
        };
    }).sort((a, b) => b.percentage - a.percentage); 
    
    const [first, second, third, fourth] = percentageResults; 
    let assessment = "";

    if (typeInfo.isBalanced) { 
        assessment += assessmentTextParts.balancedProfileIntro;
        assessment += assessmentTextParts.balancedDistribution;
        assessment += `- <strong>${currentCDs[first.name].name}:</strong> ${first.percentage.toFixed(1)}% <br />`;
        assessment += `- <strong>${currentCDs[second.name].name}:</strong> ${second.percentage.toFixed(1)}% <br />`;
        assessment += `- <strong>${currentCDs[third.name].name}:</strong> ${third.percentage.toFixed(1)}% <br />`;
        assessment += `- <strong>${currentCDs[fourth.name].name}:</strong> ${fourth.percentage.toFixed(1)}% <br /><br />`;

        const firstColorDetails = currentCDs[first.name].characteristics;
        const secondColorDetails = currentCDs[second.name].characteristics; 

        if (first.percentage - second.percentage > 3) { 
             assessment += assessmentTextParts.balancedStrongestEmphasis(
                currentCDs[first.name].name,
                firstColorDetails.strengths.split(',')[0],
                firstColorDetails.strengths.split(',')[1],
                firstColorDetails.motivation.split(',')[0],
                currentCDs[second.name].name,
                second.percentage.toFixed(1)
            );
        } else { 
             assessment += assessmentTextParts.balancedGeneralEmphasis(
                currentCDs[first.name].name, first.percentage.toFixed(1),
                currentCDs[second.name].name, second.percentage.toFixed(1)
            );
        }
        
        if ((first.name === "Dynamikrot" && second.name === "Freigeistgelb") || (first.name === "Freigeistgelb" && second.name === "Dynamikrot")) {
            assessment += assessmentTextParts.comboRedYellow;
        } else if ((first.name === "Balancegrün" && second.name === "Logikblau") || (first.name === "Logikblau" && second.name === "Balancegrün")) {
            assessment += assessmentTextParts.comboGreenBlue;
        } else if ((first.name === "Dynamikrot" && second.name === "Logikblau") || (first.name === "Logikblau" && second.name === "Dynamikrot")) {
            assessment += assessmentTextParts.comboRedBlue;
        } else if ((first.name === "Freigeistgelb" && second.name === "Balancegrün") || (first.name === "Balancegrün" && second.name === "Freigeistgelb")) {
            assessment += assessmentTextParts.comboYellowGreen;
        }
         assessment += assessmentTextParts.balancedAdvice;

    } else { 
        const firstColorDetails = currentCDs[first.name].characteristics;
        
        assessment = assessmentTextParts.dominantProfileIntro(
            currentCDs[first.name].name, first.percentage.toFixed(1),
            currentCDs[second.name].name, second.percentage.toFixed(1)
        );
    
        assessment += assessmentTextParts.dominantPreference(
            currentCDs[first.name].name, firstColorDetails.strengths, firstColorDetails.motivation,
            firstColorDetails.communication, firstColorDetails.challenges
        );

        if (second.percentage > 20) { 
            const secondColorDetails = currentCDs[second.name].characteristics; 
            assessment += assessmentTextParts.secondaryPreference(
                currentCDs[second.name].name, secondColorDetails.strengths, secondColorDetails.motivation,
                secondColorDetails.communication, secondColorDetails.challenges
            );
        }
        
        if ((first.name === "Dynamikrot" && second.name === "Freigeistgelb" && second.percentage > 20) || (first.name === "Freigeistgelb" && second.name === "Dynamikrot" && second.percentage > 20)) {
            assessment += assessmentTextParts.comboRedYellow;
        } else if ((first.name === "Balancegrün" && second.name === "Logikblau" && second.percentage > 20) || (first.name === "Logikblau" && second.name === "Balancegrün" && second.percentage > 20)) {
            assessment += assessmentTextParts.comboGreenBlue;
        } else if ((first.name === "Dynamikrot" && second.name === "Logikblau" && second.percentage > 20) || (first.name === "Logikblau" && second.name === "Dynamikrot" && second.percentage > 20)) {
            assessment += assessmentTextParts.comboRedBlue;
        } else if ((first.name === "Freigeistgelb" && second.name === "Balancegrün" && second.percentage > 20) || (first.name === "Balancegrün" && second.name === "Freigeistgelb" && second.percentage > 20)) {
            assessment += assessmentTextParts.comboYellowGreen;
        }
    
        assessment += assessmentTextParts.lessInFocus(
            currentCDs[third.name].name, third.percentage.toFixed(1),
            currentCDs[fourth.name].name, fourth.percentage.toFixed(1)
        );
    }
    assessment += assessmentTextParts.conclusion;
    return assessment;
  }, [currentLangData]);

  // Removed generateLLMAnalysis function

  const finalResultsData = useMemo(() => calculateResults, [calculateResults]);
  
  const colorCompassTypeInfo = useMemo(() => {
      const totalUserScore = Object.values(finalResultsData).reduce((sum, score) => sum + score, 0);
      const percentageResultsForType = Object.keys(finalResultsData).map(colorKey => ({
          name: colorKey, 
          score: finalResultsData[colorKey],
          percentage: totalUserScore > 0 ? ((finalResultsData[colorKey] / totalUserScore) * 100) : 0,
      })).sort((a, b) => b.percentage - a.percentage);
      
      const rawTypeInfo = getColorCompassType(percentageResultsForType, totalUserScore);
      let displayTypeString = rawTypeInfo.typeString; 
      
      if(rawTypeInfo.internalKey === "balanced") { 
        displayTypeString = `${currentLangData.typePrefix} ${currentLangData.balancedTypeLabel} ${rawTypeInfo.typeString}`;
      } else if (rawTypeInfo.internalKey === "not_determined") {
        displayTypeString = `${currentLangData.typePrefix} ${currentLangData.typeNotDetermined}`;
      } else if (rawTypeInfo.internalKey === "error") {
        displayTypeString = `${currentLangData.typePrefix} ${currentLangData.typeError}`;
      } else if (rawTypeInfo.typeString) { 
         displayTypeString = `${currentLangData.typePrefix} ${rawTypeInfo.typeString}`;
      }


      return {
        ...rawTypeInfo,
        typeString: displayTypeString 
      };
  }, [finalResultsData, currentLangData]);

  const individualAssessmentTextData = useMemo(() => getIndividualAssessmentText(finalResultsData, colorCompassTypeInfo), [finalResultsData, getIndividualAssessmentText, colorCompassTypeInfo]);


  const CurrentPage = () => {
    if (showPrivacyPolicy) {
        return <PrivacyPolicyPage key="privacy-page" onClose={() => setShowPrivacyPolicy(false)} currentLangData={currentLangData} />;
    }
    if (!quizStarted) {
        return <IntroductionPage key={`intro-page-${language}`} onStartQuiz={() => setQuizStarted(true)} currentLangData={currentLangData} />;
    }
    if (showResults) {
        return (
            <ResultsDisplay
              key={`results-page-${language}`}
              finalResults={finalResultsData}
              colorCompassType={colorCompassTypeInfo}
              individualAssessmentText={individualAssessmentTextData}
              // generateLLMAnalysis removed
              // loadingAnalysis removed
              // llmAnalysisResult removed
              handleRestart={handleRestart}
              currentLangData={currentLangData}
              colorHexMap={COLOR_HEX_MAP} 
            />
        );
    }
    
    const currentQuestion = currentLangData.questions && currentLangData.questions[currentQuestionIndex];
    if (!currentQuestion) {
        console.warn("Current question not available, restarting quiz or showing error.");
        return <div className="text-center p-8">Error: Question data not found. Please restart.</div>;
    }

    return (
        <QuestionDisplay
            key={`question-${currentQuestionIndex}-${language}`} 
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={currentLangData.questions.length}
            shuffledOptions={shuffledOptions}
            currentQuestionRatings={answers[currentQuestionIndex]?.ratings || {}}
            handleRatingChange={handleRatingChange}
            errorMessage={errorMessage}
            handleBack={handleBack}
            handleResetCurrentQuestion={handleResetCurrentQuestion}
            handleNext={handleNext}
            isCurrentQuestionComplete={isCurrentQuestionComplete}
            currentLangData={currentLangData}
        />
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 flex flex-col items-center justify-center p-2 sm:p-4 font-inter antialiased relative">
      <LanguageSwitcher currentLanguage={language} onChangeLanguage={setLanguage} />
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .prose { max-width: 100%; }
        .prose h1, .prose h2, .prose h3, .prose h4 { margin-bottom: 0.5em; margin-top: 1em; font-weight: 600; }
        .prose p { margin-bottom: 0.75em; line-height: 1.65; }
        .prose ul { margin-left: 1.5em; margin-bottom: 0.75em; list-style-type: disc; }
        .prose strong { font-weight: 700; }
        .prose a { color: #4f46e5; text-decoration: underline; }
        .prose a:hover { color: #4338ca; }
        .prose br { display: block; margin-bottom: 0.5rem; content: "";}

        .overflow-x-auto::-webkit-scrollbar { height: 8px; }
        .overflow-x-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .overflow-x-auto::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 10px; }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #a5b4fc; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        `}
      </style>
      
      <div className="flex-grow flex items-center justify-center w-full mt-10 mb-10">
        <CurrentPage />
      </div>
      
      {!showPrivacyPolicy && <Footer onShowPrivacy={() => setShowPrivacyPolicy(true)} currentLangData={currentLangData} />}
    </div>
  );
}

export default App;
