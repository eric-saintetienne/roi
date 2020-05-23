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


function calculate() {
  var downpayment = parseInt($mort_down.val())
  var principal = parseInt($mort_princ.val())
  var rate = parseFloat($mort_rate.val())
  var refurbishments = parseInt($refurb.val())
  var monthly_rental = parseInt($monthly_rental.val())
  var expenditures = parseInt($expenditures.val())
  var mort_duration = parseInt($mort_duration.val())
  var conveyancing = parseInt($convey.text())

  var mort_monthly = monthlyPayment(principal, 12*mort_duration, rate/12/100)
  var interests = parseInt(12*mort_duration*mort_monthly - principal)
  var hmrc_price = downpayment + principal
  var stamp_duty = isNaN(hmrc_price) ? 0 : parseInt(stampduty_cost(hmrc_price))
  var effective_sd_rate = 100.0 * stamp_duty / hmrc_price

  var actual_expenditures = parseInt(monthly_rental*expenditures/100.0)
  var total_out = downpayment + principal + interests + refurbishments + conveyancing + stamp_duty
  var annual_in = 12*(monthly_rental-actual_expenditures)

  var roi = 100.0 * annual_in / total_out

  $mort_down.val(isNaN(downpayment) ? 0 : downpayment)
  $mort_princ.val(isNaN(principal) ? 0 : principal)
  $mort_rate.val(isNaN(rate) ? '0.0' : rate.toFixed(1))
  $mort_monthly.text(isNaN(mort_monthly) ? 0 : parseInt(mort_monthly))
  $refurb.val(isNaN(refurbishments) ? 0 : refurbishments)
  $convey.val(conveyancing)
  $stampduty.text(isNaN(stamp_duty) ? 0 : stamp_duty)
  $monthly_rental.val(isNaN(monthly_rental) ? 0 : monthly_rental)
  $interests.text(isNaN(interests) ? 0 : interests)
  $expenditures.val(isNaN(expenditures) ? 0 : expenditures)
  $total_out.text(isNaN(total_out) ? 0 : total_out)
  $actual_expenditures.text(isNaN(actual_expenditures) ? 0 : actual_expenditures)
  $annual_in.text(isNaN(annual_in) ? 0 : annual_in)
  $roi.text(isFinite(roi) ? 'ROI: ' + roi.toFixed(2) + '%' : '')
  $effective_sd_rate.text(isNaN(effective_sd_rate) ? "0.0" : effective_sd_rate.toFixed(2))

  /* Save cookies */
  $.cookie('mort_duration', mort_duration);
  $.cookie('downpayment', downpayment);
  $.cookie('monthly_rental', monthly_rental);
  $.cookie('principal', principal);
  $.cookie('expenditures', expenditures);
  $.cookie('rate', rate);
  $.cookie('refurbishments', refurbishments);
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

  $("#button").on("click", calculate())
})
