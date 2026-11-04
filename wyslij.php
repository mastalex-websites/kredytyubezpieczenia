<?php

$odbiorca = 'kontakt@kredytyubezpieczenia.com';

function pole($n) { return trim((string)($_POST[$n] ?? '')); }
function wroc($stan) { header('Location: index.html?formularz=' . $stan . '#formularz', true, 303); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { wroc('blad'); }
if (pole('www') !== '') { wroc('ok'); }

$nazwa = pole('nazwa'); $telefon = pole('telefon'); $mail = pole('mail');
if ($nazwa === '' || $telefon === '' || pole('kwota') === '' || pole('cel') === '' || pole('zgoda') !== '1' || !filter_var($mail, FILTER_VALIDATE_EMAIL)) { wroc('blad'); }

$tresc = "Formularz ze strony kredytyubezpieczenia.com\n\n"
  . "Nazwa / imię i nazwisko: $nazwa\nTelefon: $telefon\nE-mail: $mail\n"
  . 'Kwota kredytu: ' . pole('kwota') . "\nCel kredytu: " . pole('cel') . "\n\n"
  . "Dodatkowe informacje:\n" . pole('zobowiazania') . "\n";

$naglowki = "From: Formularz <$odbiorca>\r\nReply-To: $mail\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$temat = '=?UTF-8?B?' . base64_encode('Zapytanie ze strony: ' . str_replace(["\r", "\n"], ' ', $nazwa)) . '?=';
wroc(mail($odbiorca, $temat, $tresc, $naglowki) ? 'ok' : 'blad');
