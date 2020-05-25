var $mort_down, $monthly_rental, $mort_princ, $expenditures, $mort_rate, $refurb, $convey, $stampduty, $total_out, $annual_in, $roi, $mort_duration, $actual_expenditures, $interests, $mort_monthly

var default_conveyancing = 1250

function monthlyPayment(p, n, i) {
  return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

function stampduty_cost(price) {
  var original = price
  var stamp = 0

  if (price < 125000) return stamp + price*0.03;
  stamp += 125000*0.03

  if (price < 250000) return stamp + (price - 125000)*0.05
  stamp += (250000-125000)*0.05

  if (price < 925000) return stamp + (price - 250000)*0.08
  stamp += (925000-250000)*0.08

  if (price < 1500000) return stamp + (price - 925000)*0.13
  stamp += (1500000-925000)*0.13

  return stamp + (price - 1500000)*0.15
}

function calculate(e) {
  console.log("calculate")
  var downpayment = parseInt($mort_down.val())
  if (isNaN(downpayment)) { downpayment = 0; $mort_down.val(downpayment); }

  var principal = parseInt($mort_princ.val())
  if (isNaN(principal)) { principal = 0; $mort_princ.val(principal); }

  var rate = parseFloat($mort_rate.val())
  if (isNaN(rate)) { rate = 0; $mort_rate.val(rate); }

  var refurbishments = parseInt($refurb.val())
  if (isNaN(refurbishments)) { refurbishments = 0; $refurb.val(refurbishments); }

  var monthly_rental = parseInt($monthly_rental.val())
  if (isNaN(monthly_rental)) { monthly_rental = 0; $monthly_rental.val(monthly_rental); }

  var expenditures = parseInt($expenditures.val())
  if (isNaN(expenditures)) { expenditures = 0; $expenditures.val(expenditures); }

  var mort_duration = parseInt($mort_duration.val())
  if (isNaN(mort_duration)) { mort_duration = 0; $mort_duration.val(mort_duration); }

  var conveyancing = parseInt($convey.text())
  $convey.val(conveyancing)

  var mort_monthly = monthlyPayment(principal, 12*mort_duration, rate/12/100)
  var interests = parseInt(12*mort_duration*mort_monthly - principal)
  if (isNaN(interests)) interests = 0
  var hmrc_price = downpayment + principal
  var stamp_duty = isNaN(hmrc_price) ? 0 : parseInt(stampduty_cost(hmrc_price))
  var effective_sd_rate = 100.0 * stamp_duty / hmrc_price

  var actual_expenditures = parseInt(monthly_rental*expenditures/100.0)
  var total_out = downpayment + principal + interests + refurbishments + conveyancing + stamp_duty
  var annual_in = 12*(monthly_rental-actual_expenditures)

  var roi = 100.0 * annual_in / total_out

  $stampduty.text(isNaN(stamp_duty) ? 0 : stamp_duty)
  $interests.text(isNaN(interests) ? 0 : interests)
  $total_out.text(isNaN(total_out) ? 0 : total_out)
  $actual_expenditures.text(isNaN(actual_expenditures) ? 0 : actual_expenditures)
  $annual_in.text(isNaN(annual_in) ? 0 : annual_in)

  $roi.text(isFinite(roi) ? 'ROI: ' + roi.toFixed(2) + '%' : '')
  $mort_monthly.text(isNaN(mort_monthly) ? 0 : parseInt(mort_monthly))
  $effective_sd_rate.text(isNaN(effective_sd_rate) ? "0.0" : effective_sd_rate.toFixed(2))

  /* Save cookies */
  $.cookie('mort_duration', mort_duration);
  $.cookie('downpayment', downpayment);
  $.cookie('monthly_rental', monthly_rental);
  $.cookie('principal', principal);
  $.cookie('expenditures', expenditures);
  $.cookie('rate', rate);
  $.cookie('refurbishments', refurbishments);

  if (e)
    e.preventDefault()
  return false
}

$(document).ready(function() {
  $mort_down = $("#mort-down")
  $monthly_rental = $("#monthly-rental")
  $mort_princ = $("#mort-princ")
  $expenditures = $("#expenditures")
  $actual_expenditures = $("#actual-expenditures")
  $mort_rate = $("#mort-rate")
  $mort_monthly = $("#mort-monthly")
  $refurb = $("#refurb")
  $convey = $("#convey")
  $interests = $("#interests")
  $stampduty = $("#stampduty")
  $total_out = $("#total-out")
  $annual_in = $("#annual-in")
  $roi = $("#roi")
  $mort_duration = $("#mort_duration")
  $effective_sd_rate= $("#effective-stamp-duty-rate")

  $mort_down.change(calculate)
  $monthly_rental.change(calculate)
  $mort_princ.change(calculate)
  $expenditures.change(calculate)
  $actual_expenditures.change(calculate)
  $mort_rate.change(calculate)
  $refurb.change(calculate)
  $mort_duration.change(calculate)

  /* Load from cookies */
  $mort_duration.val($.cookie('mort_duration'))
  $mort_down.val($.cookie('downpayment'))
  $monthly_rental.val($.cookie('monthly_rental'))
  $mort_princ.val($.cookie('principal'))
  $expenditures.val($.cookie('expenditures'))
  $mort_rate.val($.cookie('rate'))
  $refurb.val($.cookie('refurbishments'))
  $convey.text(default_conveyancing)
  calculate()

  $("#button").on("click", calculate)
  $mort_duration.focus()
})
